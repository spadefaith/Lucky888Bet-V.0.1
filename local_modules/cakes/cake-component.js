function Cake(name, template, options){
    this.name = name;
    this.template = template;
    this.handlers = options.handlers;
    this.subscribe = options.subscribe;
    this.data = {};
    this.root = options.root;
    this.items = false;
    this.type = options.type || 'view';
    this.toggle = options.toggle;
    this.targets = {};
    this.animate = options.animate;
    this.role = options.role;
    this.isReady = false;

    this.await = {};//storage of async handlers


    this.utils = {
        createFn(name, variable){
            let o = {[name]:function(){return variable}};
            return o[name];
        },
    };


    options.data && options.data.bind(this.data)(this);
    ((name == 'app') || (options.role == 'app')) && (()=>{ this.staticComponent = options.static || [];})();
    options.trigger && options.trigger.bind(this)();
    options.utils && options.utils.bind(this.utils)(this);

    this.container = {};


    this.compile = new Promise((res)=>{

        this._bindHandlers();
        res();
    }).then(()=>{

        this._bindSubscribe();
    }).then(()=>{
        
        switch(this.type == 'view' && !!this.template){
            case true:
                this.createElementAsync();
                break;
            default:
                this.isStatic = false;
                break
        };
    })

};

Cake.prototype.isStatic = false;
Cake.prototype.hasEvent = false;
Cake.prototype.isConnected = false;
Cake.prototype.destroyed = false;
Cake.prototype.isCreated = false;

Cake.prototype.Subscribe = function(handler){
    this.$observer.registerSubscribe({
        [handler.listenTo]:{
            [handler.original]:[handler],
        }
    })
};

Cake.prototype.Node = function(el){
    return new Piece(el);
};

Cake.prototype._bindHandlers = function(){
    for (let key in this.handlers){
        let fn = this.handlers[key];
        let originalName = fn.name;
        fn = fn.bind(this);
        fn.original = originalName;
        fn.binded = this.name;
        this.handlers[originalName] = fn;

        this.initAwaitHandlers(key);
    };
    if (!this.await.destroy){
        this.await.destroy = Promise.resolve();
    }
    if (!this.await.animateRemove){
        this.await.animateRemove = Promise.resolve();
    }
};

Cake.prototype.initAwaitHandlers = function(handlerName){
    //initializing awaits for handlers;
    this.await[handlerName] = Promise.resolve();
};

Cake.prototype._bindSubscribe = function(){
    //binding the subscribe to component;
    let flattened = {};
    for (let component in this.subscribe){

        subscribe = this.subscribe[component];
        let isMany = !!subscribe.components && !!subscribe.handler;
        if (isMany){

            /**
             * multiple components triggering the same event;
             * this component is listening to that one event;
             * {
             *     components:[],
             *     handler(){},
             * }
             */
            let event = component;
            let {components, handler} = subscribe;
            handler =  handler.bind(this);
            handler.binded = this.name;
            handler.original = event;
            for (let c = 0; c < components.length; c++){
                let component = components[c];
  
                if (!flattened[component]){
                    flattened[component] = {};
                };
                if (!flattened[component][event]){
                    flattened[component][event] = [];
                }
                handler.listenTo = component;
                flattened[component][event].push(handler);
            };

        } else {
            
            if (!flattened[component]){
                flattened[component] = {};
            };
            /**
             * single event is triggerd by a component;
             * {
             *      event:{
             *          handler(){},
             *      }
             * }
             */
             let fns = subscribe;//object
             for (let fn in fns){
                 let handler = fns[fn];
                 let original = handler.name;
                 handler = handler.bind(this);
                 handler.original = original;
                 handler.binded = this.name;
                 handler.listenTo = component;

                 if (!flattened[component][original]){
                    flattened[component][original] = [];
                 };
                 
                 flattened[component][original].push(handler);
             };
        };
    };
    this.subscribe = flattened;
};

Cake.prototype.notifyStaticComponent = function(page, event, data){

    Cakes.Observer.notify(page, event, data, this.staticComponent[page], true, this.name);

};

Cake.prototype.doFor = function(prop, newValue){
    // console.trace();
    const getHTML = ()=>{
        return this.html;
    };
    if (newValue == null) return;
    this.$attrib._notifyFor(prop, newValue, null, this.name, getHTML());
};

Cake.prototype.doToggle = function(prop, newValue){
    this.$attrib._notifyToggle(prop, newValue, null, this.name, this.html);
};
Cake.prototype.doSwitch = function(prop, newValue){
    this.$attrib._notifySwitch(prop, newValue, null, this.name, this.html);
};
Cake.prototype.doIf = function(prop, newValue){
    this.$attrib._notifyIf(prop, newValue, null, this.name, this.html);
};
Cake.prototype.$animate = function(moment){
    //normalize the two sourse, attr, and component declaration;
    let ata = this.$attrib.getWatchItemsByType(this.name, 'animate');
    let da = this.animate;
    let arr = [];
    
    ;(()=>{
        if ((!ata.length && !(ata instanceof Array)) || !da){return;}
        for (let a = 0; a < ata.length; a++){
            let at = ata[a];
            let {ns:name, selector} = at;
            //declare name space in html, mapped to component animation declaration
            if (at.ns){
                if (da[name]){
                    let ns = da[name];
                    Object.assign(at, da[name]);
                    delete da[name];
                };
            } else {
                //declared animation in html, using animation name;
                arr.push(ata);
            };
        };
    })();
    if (!ata.length) {return false}
    //tweak component declared animation;
    ;(()=>{
        let obj = {};
        let selector = {};
        for (let key in da){
            selector.val = key;
            obj.selector = selector;
            Object.assign(obj, da[key]);
            ata.push(obj);
            //reset;
            obj = {};
            selector = {};
        };
    })();

    // console.log(ata);

    
    return new Mo(ata, this.html).animate(moment);
    // return Promise.resolve();
};

Cake.prototype.$templating = function(data, t, isConvert){
    let template = t || this.template;
    return new Templating(data, template, isConvert).createElement();
};

Cake.prototype.createElement = function(){
    let isSelector = this.template.substring(0,1) == '#';
    if (!isSelector) return;
    let selector =  this.template.substr(1);
    let query = document.getElementById(selector);
    let isTemplate = this.isTemplate = query && query.toString().includes('Template');
    switch(isTemplate){
        //template html
        case true:{
            // console.time(this.name)
            let element = query.getContent(true);
            element.cake_component = this.name;
            // console.timeEnd(this.name)
            this.html = this.Node(element);
            this._parseHTML(this.isStatic).then(()=>{
                this._watchBindedItems()//these are the binded data declared in html;
            })
        } break;
        case null:{}
        break;
        //static html
        default:{
            let element = query;
            element.cake_component = this.name;
            this.html = this.Node(element);
            this.isStatic = true;
 
            this._parseHTML(this.isStatic).then(()=>{
                
            })
        };
    };
};

Cake.prototype.createElementAsync = function(){

    new Promise((res)=>{
        this.createElement();
        res();
    }).then(()=>{
        // console.log(`${this.name} is rendered async`)
        this.isReady = true;
    });
    // console.log(`${this.name} is creating async el`)
};

Cake.prototype._isParsed = false;

Cake.prototype._parseHTML = function(isStatic=false){
    return this.$attrib.inject(this.html, this.name, isStatic).then(()=>{
        // console.log(this.html, this.name)
        this.original = this.html.cloneNode();
        this._isParsed = true;
    });
};

Cake.prototype.render = function(options){
    let payload = null;
    const getValue = (item)=>{
        return this.data[item] || this.$scope[item] || null;
    };

    (!this.isReady) && this.createElement();

    let {root, multiple, cleaned, emit, static, hashed, data} = options || {};

    (hashed === true) && this.$hash.add(this.name);

    (!this.template) && this.fire.isConnected && this.fire.isConnected({emit}, true);
    (!!root) && (this.root = root);
    (multiple) && this._smoothReset();
    
    return this.await.destroy.then(()=>{
        return this.await.animateRemove;
    }).then(()=>{
        new Promise((res, rej)=>{
            res();
        }).then(()=>{
            //html restructure base on data;
            //by mutation;

            let forItems = this.$attrib.getWatchItemsByType(this.name, 'for');
            // console.log(forItems);
            for (let i = 0; i < forItems.length; i++){
                // console.log(forItems)
                let nv = getValue(forItems[i]);
                // console.log(nv);
                // console.log("🚀 ~ file: cake-component.js ~ line 285 ~ getValue ~ item", nv)
                this.doFor(forItems[i], nv);
            };

            return this.html;
        }).then((element)=>{
            payload = {element, emit};
            this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
            return element;
        }).then((element)=>{
            if (this.isStatic){
                //static component, those already attached to DOM;
            } else {
                //replace the mustache here;
                let prom = (!data)?Promise.resolve():(()=>{
                    return new Promise((res)=>{
                        let el = element.getElement();
                        el = this.$templating(data, el);
                        this.html = element = this.Node(el);
                        this.html.replaceDataSrc();
                        
                        data = null;
                        res();
                    })
                })();
                return prom.then(()=>{
                    element.appendTo(this.root, cleaned);
                    this.isConnected = true;
                });
            }
        }).then(()=>{
            this.$animate('render');
        }).then(()=>{
            this.findTarget();
        }).then(()=>{
            this.findContainer();
        }).then(()=>{
            this.addEvent(static, multiple);
        }).then(()=>{
            this.fire.isConnected && this.fire.isConnected(payload, true);
        }).then(()=>{
            //switch
            let switchItems = this.$attrib.getWatchItemsByType(this.name, 'switch');
            for (let i = 0; i < switchItems.length; i++){
                this.doSwitch(switchItems[i], getValue(switchItems[i]));
            };
        });

    })
};

Cake.prototype.renderAsync = function(options){
    this.render(options).then(()=>{
        this.$persist.append(this.name);
    });
};

Cake.prototype._smoothReset = function(){
    this.isConnected = false;
    this.html = this.original.cloneNode();
};

Cake.prototype._hardReset = function(name){

    this.isConnected = false;
    this.$persist.remove(name);
    //remove the element first;
    
    //clone the element;

    this.html = this.original.cloneNode();

};

Cake.prototype.reset = function(){
    let animate = this.$animate('remove');
    if (animate instanceof Promise){
        this.await.animateRemove = new Promise((res)=>{
            animate.then(()=>{
                //it is very important to remove first the component
                //before hard reset;
                this.html.remove();
            }).then(()=>{
                this._hardReset(this.name);
            }).then(()=>{
                res();
            });
        });
    } else {
        this.html.remove(this.name);
        this._hardReset(this.name);
    }
};

Cake.prototype.addEvent = function (static, multiple){
    let isStatic = !!static;
    let isMultiple = !!multiple;
    if (isMultiple && isStatic){
        return false;
    };
    let component = this.name;
    function notify(event, component, isPrevent){
        return function(e){
            if (isPrevent){
                e.preventDefault();
            };
            Cakes.Observer.notify(component, event, e);
        };
    };
    if (!this.targets) return;
    for (let event in this.targets){
        let cf = this.targets[event];
  
        for (let item of cf){
            let {sel, el, cb} = item;
            cb = cb || event;
            if (!el.Ref().get('__cake__events')){
                el.Ref().set('__cake__events', {});
            }; 
            let store = el.Ref().get('__cake__events');
            
            if (!store[cb]){
                let isPrevented = event.substring(0,1) == '~';
                // console.log(isPrevented, event);
                el.addEventListener(event, notify(cb, component, isPrevented), true);
                store[cb] = true;
                el.Ref().set('__cake__events', store);
            } else {continue};
        };
    };
};

Cake.prototype.findTarget = function(){
    let q = this.$attrib.getEventTarget(this.name);
    let e = JSON.parse(JSON.stringify(q));//deep cloning
    for (let item of e){
        item.el = document.querySelector(`[data-event=${item.sel}]`);
        if (!this.targets[item.event]){
            this.targets[item.event] = [];
        };
        this.targets[item.event].push(item);
    };
}; 

Cake.prototype.toggler = function(_this){
    /*
        @params
        {basis} - comparison of elements;
        {cls} - class to toggle;
        {mode} - radio/ switch;
        {sel} - siblings selector;
        {persist} - bool;
    */
    let attrToggle = this.$attrib.getWatchItemsByType(this.name, 'toggle');

    let cl = class{
        constructor(bind, bases, html, _this){
            this.toggle = _this.toggle;
            this.bind = bind;
            this.bases = bases;
            this.cache = _this.$cache;
            this.html = html;
        }
        check(bind){
            let config = this.toggle[bind];


            // console.log(this.toggle)

            if (!config){ 
                console.error(`${bind} is not found in toggle! choose from ${JSON.stringify(Object.keys(this.toggle))}`);
            } else {
                if (attrToggle.length){
                    let {ns} = config;
                    //toggle is use only for namespacing;
                    let f = attrToggle.find(item=>{return item.name == `ns-${ns}`});
                    f && (config.sel = `[data-toggle=${f.sel}]`);
                };
                return config;
            };
        }
        _toggle(){
            let config = this.check(this.bind);
            if(!config){ return;}
            let {basis='data-name', cls='is-active', mode='radio', sel, persist=true} = config;
            let targets = this.html.querySelectorAll(sel);
            if (!targets.length) { return; };

            let prev, next;

            // console.log(targets);

            if (targets.length == 1){
                let isbool = typeof this.bases == 'boolean'
                let isforce =  !!this.bases;
                let el =  targets[0];
                // console.log(isbool, isforce)
                if (persist){
                    const _forceState = function(el, cls, isforce){
                        if(isforce){
                            if (el.classList.contains(cls)){
                                el.classList.remove(cls);
                            };
                        } else {
                            if (!el.classList.contains(cls)){
                                el.classList.add(cls);
                            };
                        }
                    };
                    if (isbool){
                        if (isforce){
                            this.cache.createOrUpdate(this.bind, true);
                            _forceState(el, cls, true);                 
                        } else {
                            this.cache.createOrUpdate(this.bind,false);                          
                            _forceState(el, cls, false);                 
                        }
                        el.classList.toggle(cls);
                    } else {
                        this.cache.createOrUpdate(this.bind, !el.classList.contains(cls));
                        el.classList.toggle(cls);
                    };
                };
            } else {
                for (let t = 0; t < targets.length; t++){
                    let el = targets[t];
                    let has = el.classList.contains(cls);
                    let attr = el.getAttribute(basis);
                    
                    if (attr == this.bases){
                        if (mode == 'switch'){
                            el.classList.toggle(cls);
                        } else {
                            if (!has){ el.classList.add(cls) };
                        };
                        if (persist){
                            this.cache.createOrUpdate(this.bind, attr);
                        };
                        next = attr;
                    } else {
                        if(has){ 
                            el.classList.remove(cls)
                            prev = el.getAttribute(basis);
                        };
                    };
                };
            }
            return {prev, next};
        }
        _recall(){
            let config = this.check(this.bind);
            if(!config){ return;}
            let {basis='data-name', cls='is-active',  sel} = config;
            return this.cache.get(this.bind).then(result=>{
                let bases = result.length && result[0][this.bind];                
                let targets = this.html.querySelectorAll(sel);
                if (!targets.length) { return ;};
                if (targets.length == 1){
                    let el = targets[0];
                    // console.log(bases, this.bind);
                    if (bases){
                        el.classList.add(cls);
                    };
                } else {
                    for (let t = 0; t < targets.length; t++){
                        let el = targets[t];
                        let has = el.classList.contains(cls);
                        let attr = el.getAttribute(basis);
                        if (attr == bases){
                            if (!has){ el.classList.add(cls) };
                        };
                    };
                };
                return bases;
            });
        }
    };
    let fn = (bind, bases)=>{
        return new cl(bind, bases, this.html, this)._toggle();
    };
    fn.recall = (bind)=>{
        return new cl(bind, false, this.html, this)._recall();
    };
    return fn;
};

Cake.prototype.findContainer = function(){
    let containers = this.html.getContainers();

    for (let c = 0; c < containers.length; c++){
        let el = containers[c];
        let name = el.dataset.container;
        if (name){
            this.container[name] = el;
        };
    };
};

Cake.prototype._watchBindedItems = function(){
    if (!this.items.length){
        this.items = this.$attrib.getWatchItems(this.name);
        Cakes.Scope.watch(this.items);
    };
};


Cake.prototype.observer = function(subscribe){
    function callback(name){
        return this.handler[name]
    }
    this.observer = new Observer(this, subscribe, callback.bind(this));
};

Cake.prototype.variable = function(obj){
    let vary = Object.keys(obj);
    let validate = {};
    let values = [];
    function invalid(name, test, type){
        if (!test){
            validate[name] = `value is not '${type}'`;
        };
    };
    for (let key in obj){
        let config = obj[key];
        let {type, value} = config;
        let test;
        if (['string', 'number'].includes(type)){
            test = typeof value == type;
        } else if (value instanceof Array){
            test = type == 'array';
        } else {
            test = type == 'object';
        }
        values.push(value);
        invalid(key, test, type);
    }
    if (Object.keys(validate).length){
        throw new Error(JSON.stringify(validate));
    } else {
        return values;
    }
};