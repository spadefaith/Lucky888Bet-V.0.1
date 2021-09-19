;(function(global){
    global.env = {
        destructure:true,
    };
    const env = global.env;
    try {let {a} = {a:true};} catch(err){env.destructure = false};

})(window);

;(function(){
    if (!Object.keys) {
        Object.keys = function(obj) {
          var keys = [];
      
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
              keys.push(i);
            }
          }
      
          return keys;
        };
    }
})();



;(function(global){
    const TYPES = {
        typeof: function(ctx){
            switch(true){
                case typeof ctx == 'string': return 'string';
                case typeof ctx == 'number': return 'number';
                case ctx instanceof Array: return 'array';
                case ctx instanceof Function: return 'function';
                case ctx instanceof HTMLCollection: return 'htmlcollection';
                case ctx instanceof NodeList: return 'htmlnodelist';
                case ctx instanceof Element: return 'domlement';
                case ctx instanceof Object: return 'object';
            };
        },
        isArray:function(ctx){
            return this.typeof(ctx) == 'array';
        },
        isObject:function(ctx){
            return this.typeof(ctx) == 'object';
        },
        isNumber:function(ctx){
            return this.typeof(ctx) == 'number';
        },
        isString:function(ctx){
            return this.typeof(ctx) == 'string';
        },
        isHTMLCollection:function(ctx){
            return this.typeof(ctx) == 'htmlcollection';
        },
        isNodeList:function(ctx){
            return this.typeof(ctx) == 'htmlnodelist';
        },
        isElement:function(ctx){
            return this.typeof(ctx) == 'domlement';
        },
        isFunction:function(ctx){
            return this.typeof(ctx) == 'function';
        },
    };
    const LOOP = {
        each:function(ctx, fn, type){
            if (type == 'object'){
                let i = 0;
                for (let key in ctx){
                    fn({key, value:ctx[key]}, i);
                    i = i + 1;
                };
            } else {
                for (let a = 0; a < ctx.length; a++){
                    fn(ctx[a], a);
                }
            };
        },
        map:function(ctx, fn){
            let type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
            let st = ctx.length &&  type == 'array'?[]:{};
            this.each(ctx, function(obj, index){
                let r = fn(obj, index);
                if (type == 'object'){
                    st[r.key] = r.value;
                } else {
                    st.push(r)
                };
            }, type);
            return st;
        },
        reduce: function(ctx, accu, fn){
            let type = TYPES.typeof(ctx);
            this.each(ctx, function(obj, index){
                accu = fn(obj,accu, index);
            }, type);
            return accu;
        },
        filter:function(ctx, fn){
            let type = TYPES.isArray(ctx) || ctx.length ? 'array': 'object';
            let st = ctx.length && type == 'array'?[]:{};
            this.each(ctx, function(obj, index){
                let r = fn(obj, index);
                if (r){
                    if (type == 'object'){
                        st[obj.key] = obj.value;
                    } else {
                        st.push(obj.value);
                    };
                };
            }, type);
            return st;
        },
    };

    const OTHERS = {
        perf:function(fn){
            console.time('test');
            fn();
            console.timeEnd('test');
        },
    }
    
    try {
        global.UTILS = {...LOOP, ...TYPES, ...OTHERS};
    } catch (err){
        global.UTILS = {};

        let iter = LOOP.each;
        iter(LOOP, function(key, value){
            global.UTILS[key] = value;
        });
        iter(TYPES, function(key, value){
            global.UTILS[key] = value;
        });
        iter(OTHERS, function(key, value){
            global.UTILS[key] = value;
        });
    };

})(window);

function Attrib(){
    this.uiid = 0;
    this.notify = [];

    this.st  = { };
    this.cacheStatic = [];

    this.store = new StorageKit({
        storage:sessionStorage,
        name:'_cake_component_cf',

    });
};

/*
    watch for the (name) which is registered to the scope
    get all attribute with that name,
    get all component holding that (name),
    and notify them;
*/

Attrib.prototype._getConfig = function(type, prop, newValue, prevValue, component){
    // console.trace();
    /*
        newValue is null, when emptying the scope;
    */

    //scape;
    if (newValue == null) {return []};
    if (newValue == prevValue && type != 'bind'){ return [];};

    let id = `${type}-${prop}-${component}`;
    let loc = Object.cache._getConfig;
    if (!loc){
        loc = Object.cache._getConfig = {};
    };
    if (!loc[id]){
        var st = (component) ? ( (this.st[component] && this.st[component][type]) || [] ) : (()=>{
            let ctx = [];
            for (let component in this.st){
                let s = this.st[component];
                if (s[type]){
                    for (let i = 0; i < s[type].length; i++){
                        let item = s[type][i];
                        // console.log(item.bind, prop, item);
                        if (item.bind == prop){
                            // console.log(type, item);
                            ctx.push({...item, component});
                        };
                    };
                };
            };
            return ctx;
        })();
        loc[id] = st;
    };
    return loc[id];
};

Attrib.prototype._notifyToggle = function(prop, newValue, prevValue, component, html){
    html = html || document;
    let subscribe = this._getConfig('toggle',prop, newValue, prevValue);
    // if (!configs.length) return;
    if (!subscribe){return ;};
    html = html || document;
    for (let s = 0; s < subscribe.length; s++){
        let sub = subscribe[s];
        if (!sub) continue;
        let {sel, bind, value, ops} = sub;
        let el = html.querySelector(`[data-toggle=${sel}]`);


        //to do
        if (value == prevValue){
            el && el.classList.remove('is-active');
        }  
        if (value == newValue){
            if (el){
                if (el.classList.contains('is-active')){
                    el.classList.remove('is-active');
                };
                el && el.classList.add('is-active');
            };
        };
    };
};

Attrib.prototype._notifySwitch = function(prop, newValue, prevValue, component, html){
    html = html || document;
    let configs = this._getConfig('switch', prop, newValue, prevValue, component);
    if (!configs.length) return;

    let forIf = {};

    for (let c = 0; c < configs.length; c++){
        let config = configs[c];
        let {bind, sel, map, cases} = config;
        let parent = html.querySelectorAll(`[data-switch-slot=${sel}]`);
        // console.log(newValue);
        //it assumes that when the switch is within data-for and it is binded on the same bind of data-for
        //then parent and newValue has the same length;

        // console.log(parent);
        for (let n = 0; n < newValue.length; n++){
            let row = newValue[n];
            let slot = parent[n];//map the parentelement by newValue index;
            let prop = row[map];
            if (prop != undefined){
                let _case = null;
                for (let c = 0; c < cases.length; c++){
                    let test = cases[c].bind.includes(prop);
                    if (test){
                        _case = cases[c];
                        break;
                    };
                };
                if (_case){
                    let {_id, bind} = _case;
                    let hit = document.querySelector(`[data-case=${sel}-${_id}]`);
                    // console.log(hit);

                    if (hit && hit.toString().includes("Element")){
                        
                        hit = hit.cloneNode(true);
                        /**********link to data-for-auto=true**************** */
                        //mark the for children as active;
                        let forChildren = hit.querySelectorAll('[data-for-auto=true]');
                        for (let f = 0; f < forChildren.length; f++){
                            let ch = forChildren[f];
                            ch.dataset.for = `${ch.dataset.for}-active`;
                        };
                        /************************************************* */
                        
                        hit.removeAttribute('data-case');
                        let template = Cake.prototype.$templating(row, hit, false);
                        // console.log(hit, row, template);
                        // console.log(slot)
                        if (hit.dataset.if){
                            let sel = hit.dataset.if;
                            let binded = template.dataset.ifBind;
                            let component = config.component;
                            let {bind} = this.getWatchItemsBySel(component,'if',sel);
    
                            if (sel){
                                if (!forIf[bind]){
                                    forIf[bind] = {};
                                };
                                forIf[bind][binded] = row;
                            }
                        }



                        

                        template.classList.remove('cake-template');
                        slot.replaceWith(template);
                    }
                }
            }
        };
    };
    
    for (let bind in forIf){
        this._notifyIf(bind, forIf[bind]);
    }

};

Attrib.prototype._notifyBind = function(prop, newValue, prevValue, component, html){
    html = html || document;
    let configs = this._getConfig('bind', prop, newValue, prevValue, component);
    if (!configs.length) return;
    for (let c = 0; c < configs.length; c++){
        let config = configs[c];
        let {attr, bind, sel} = config;
        let attrHyphen = attr.toHyphen();
        if (prop == bind){
            let els = html.querySelectorAll(`[data-bind=${sel}]`);
            for (let p = 0; p < els.length; p++){
                let el = els[p];
                if (attr == 'className'){
                    if (prevValue){
                        if (newValue){
                            el.classList.replace(prevValue, newValue);
                        } else {
                            el.classList.remove(prevValue);
                        };
                    } else {
                        el.classList.add(newValue);
                    };
                } else {
                    el.setAttribute(attrHyphen, newValue);
                    el[attr] = newValue;
                };
            };
        };
    };
};

Attrib.prototype._notifyFor = function(prop, newValue, prevValue, component, html){

    let configs = this._getConfig('for', prop, newValue, prevValue, component);
    if (!configs.length) return;
    // console.trace();
    

    let vItems = [];
    for (let c = 0; c < configs.length; c++){
        let {bind, sel, iter, ins, component} = configs[c];

        html = html || document;

        if (component){
            html = Cakes.Components[component].html
        };

        let target = html.querySelectorIncluded(`[data-for-template=${sel}]`);

        // console.log(target);

            // console.log(target.parentElement);
        let cloned = target.cloneNode(true);
        /****************remove the switch******************** */
        ;(()=>{
            let switchs = cloned && cloned.querySelectorAll(`[data-switch]`);
            if (switchs && switchs.length){
                let l = switchs.length, i = -1;
                while (++i < l){
                    let sw = switchs[i];
                    let parent = sw.parentElement;
                    let div = document.createElement('div');
                    div.dataset.switchSlot = sw.dataset.switch;
                    parent.replaceChild(div, sw);
                };
                switchs = null;
            };
        })();
        /*******************************************************/
        ;(()=>{
            let template = cloned;
            let i = -1; l = newValue.length;

            newValue = newValue.map(item=>{
                for (let key in item){
                    item[`${iter}.${key}`] = item[key];
                };
                return item;
            });

            newValue.forEach(item=>{
                // console.log(item);

                let create = Cake.prototype.$templating(item, template, false);
                // create.style.display = 'block';
                create.style.removeProperty('display');
                create.classList.remove('cake-template');
                create.removeAttribute('data-for-template');

                //trap the create if it has data-if;

                target.insertAdjacentElement('beforebegin', create);
                
                let safeSrc = create.querySelectorAll('[data-src]');
                if (safeSrc){

                    for (let s = 0; s < safeSrc.length; s++){
                        let el = safeSrc[s];
                        el.src = el.dataset.src;
                        el.removeAttribute('data-src');

                    };
                };
            })

        })();

    };
    this._notifyForAuto({ configs, newValue});
};

Attrib.prototype._notifyForAuto = function(obj){
    let {vItems, configs, newValue} = obj;
    /**************************************************************************** */
    /*
    it becomes possible in switch, that it marks the children of switch parent having [data-for] attrb by [data-for=?-active];
    */

    // console.dir(newValue);

    for (let o = 0; o < configs.length; o++){
        let config = configs[o];
        let children = config.children;
        if (!children) continue;
        let childCf = [];
        for (let c = 0; c < children.length; c++){
            let child = children[c];
            if (!this.st[config.component]){
                continue;
            }
            let cf = this.st[config.component].for.find(item=>{
                return item.sel == child;
            });
            cf && childCf.push(new Promise((res)=>{
                let {bind, sel, iter, ins} = cf;
                setTimeout(()=>{
                    // console.log(sel);
                    let targets = document.querySelectorAll(`[data-for=${sel}-active]`);
                    for (let t = 0; t < targets.length; t++){
                        let target = targets[t];
                        let prop = target.dataset.forBindKey;
                        let value = target.dataset.forBindVal;
                        // console.log(prop, newValue)

                        // console.log(value, vItems, prop);

                        // console.log(newValue, prop)

                        let props = newValue.find(item=>{
                            return item[prop] == value;
                        });

                        // console.log(props);
 
                        let pr = bind.split('.')[bind.split('.').length - 1];
     
                        
                        let datas = props[pr].length && props[pr].map(item=>{
                            
                            if (item instanceof Object){
                                return item;
                            } else {
                                return {[iter]:item};
                            };
                        });
                        if (datas){
                            for (let d = 0; d < datas.length; d++){
                                let data = datas[d];
                                let template = target.cloneNode(true);
                                let create = Cake.prototype.$templating(data, template, false);
                                
                                create.style.removeProperty('display');
                                create.classList.remove('cake-template');
                                create.removeAttribute('data-for-template');
                                target.insertAdjacentElement('beforebegin', create);
                            };
                        };

                        if (target.parentElement.tagName == 'SELECT'){
                            target.parentElement.selectedIndex = 0;
                        };
                    };
                })
            }));
        };
    };
    /**************************************************************************** */
};

Attrib.prototype._notifyForUpdate = function(prop, newValue, prevValue, component, html){
    html = html || document;
    let configs = this._getConfig('forUpdate', prop, newValue, prevValue, component);
    if (!configs.length) return;
    // console.log(configs)
    // console.log(newValue)
    for (let c = 0; c < configs.length; c++){
        let {bind, sel, iter, ins, } = configs[c];
        for (let o in newValue){
            let targets = document.querySelectorAll(`[data-for-bind-val=${o}]`);
            for (let t = 0; t < targets.length; t++){
                let target = targets[t];
                let binded = target.dataset.forBindVal;

                // console.log(binded)

                if (!target.dataset.forTemplate){
                    target.remove();
                } else {
                    let template = target.cloneNode(true);
                    template.style.removeProperty('display');
                    template.classList.remove('cake-template');
                    let dataForIteration = newValue[binded];

                    // console.log(newValue, binded, dataForIteration)

                    let i = -1; l = dataForIteration.length;
                    while(++i < l){
                        let item = dataForIteration[i];

                        let create = Cake.prototype.$templating(item, template, false);
                        // console.log(create);
                        create.classList.remove('cake-template');
                        create.removeAttribute('data-for-template');
                        target.insertAdjacentElement('beforebegin', create);
                        if (target.parentElement.tagName == 'SELECT'){
                            target.parentElement.selectedIndex = 0;
                        };
                    };
                };
            };
        };
    };
};

Attrib.prototype._notifyClass = function(prop, newValue, prevValue, component, html){
    html = html || document;
    let configs = this._getConfig('class', prop, newValue, prevValue, component);
    if (!configs.length) return;
    let proc = function(newValue, ops, testVal){
        switch(true){
            case (ops == '>'):return newValue > testVal;
            case (ops == '<'):return newValue < testVal;
            case (ops == '==='):return newValue === testVal;
            case (ops == '!=='):return newValue !== testVal;
            case (ops == '=='):return newValue == testVal;
            case (ops == '!='):return newValue != testVal;
        };
        return false;
    };
    let removeWhiteSpace = function(str){
        return str.split(" ").join("");
    }
    let cache = {};

    for (let c = 0; c < configs.length; c++){
        let config = configs[c];
        let {hasNegate, bind, testVal,className, ops, sel} = config;

        bind = removeWhiteSpace(bind);
        className = removeWhiteSpace(className);
        
        if (prop == bind){
            if (!cache[sel]){
                cache[sel] = html.querySelectorAll(`[data-class=${sel}]:not(.cake-template)`);//just to convert iterable;
            }
            let els = cache[sel];



            for (let p = 0; p < els.length; p++){
                let el = els[p];
                let test = false;
                if (ops){
                    test = proc(newValue, ops, testVal);
                    hasNegate && (test = !test);
                } else if (hasNegate){
                    test = !newValue;
                };

                if (test){
                    if (!el.classList.contains(className)){
                        el.classList.add(className);
                    }
                } else {
                    if (el.classList.contains(className)){
                        el.classList.remove(className);
                    }
                };
            };
        };
    };
};

Attrib.prototype._notifyIf = function(prop, newValue, prevValue, component, html){
    html = html || document;
    let configs = this._getConfig('if', prop, newValue, prevValue, component);
    if (!configs.length) return;

    let cache = {};

    for (let c = 0; c < configs.length; c++){
        let config = configs[c];
        let {attr, bind, sel, testval, _true, _false} = config;
        let attrHyphen = attr.toHyphen();
        

        if (prop == bind){
            if (!cache[sel]){
                cache[sel] = html.querySelectorAll(`[data-if=${sel}]:not(.cake-template)`);//just to convert iterable;
            }
            let els = cache[sel];

            for (let p = 0; p < els.length; p++){
                let el = els[p];
                let binded = el.dataset.ifBind;
                
                let data = (binded)?newValue[binded]: newValue; //it can accept, el with data-if-bind and none;

     
                let attrValue = (data instanceof Object)?data[bind]:data;//it accepts object for form options or string;

                let test = testval == null? !!attrValue : testval == attrValue;//if null. truthy or falsey. else exec testvale == attrValue
                // console.log(attrValue, test);


                if (attrValue == null){
                    el.removeAttribute(attrHyphen, attrValue);
                } else if (test){
                    let ignoreTrue = _true == 'null';
                    if (!ignoreTrue){
                        el.setAttribute(attrHyphen, attrValue);
                        el[attr] = attrValue;
                    }
                } else {
                    let ignoreFalse = _false == "null";
                    if (!ignoreFalse){
                        el.setAttribute(attrHyphen, attrValue);
                        el[attr] = attrValue;
                    }
                }
            };
        };
    };
};

Attrib.prototype.notifier = function(prop, newValue, prevValue){
    //get components holding that prop, as name;
    // console.trace();
    // console.log(`attrib has been notified by scope;`);
    let val = JSON.parse(JSON.stringify(newValue));
    // console.dir(newValue);

    new Promise((res)=>{
        this._notifyFor(prop, val, prevValue);
        res();
    }).then(()=>{
        this._notifyForUpdate(prop, val, prevValue);
    }).then(()=>{
        this._notifySwitch(prop, val, prevValue);
    }).then(()=>{
        this._notifyToggle(prop, val, prevValue);
    }).then(()=>{
        this._notifyBind(prop, val, prevValue);
    }).then(()=>{
        this._notifyIf(prop, val, prevValue);
    }).then(()=>{
        this._notifyClass(prop, val, prevValue);
    });;
};

Attrib.prototype.registerNotifier = function(fn){
    this.notify.push(fn);
};

Attrib.prototype.getEventTarget = function(component){
    let id = `${component}`
    let loc = Object.cache.getEventTarget;
    if (!loc){
        loc = Object.cache.getEventTarget = {};
    };
    if (!loc[id]){
        let cf = this.st[component];
        loc[id] = cf && (cf?.evt ?? []) || [];
    };
    return loc[id];
};

Attrib.prototype.getWatchItems = function(component){ 
    let id = `${component}`
    let loc = Object.cache.getWatchItems;
    if (!loc){
        loc = Object.cache.getWatchItems = {};
    };
    if (!loc[id]){
        let st = this.st[component] || {};
        let wt = new Set;
        for (let type in st){
            let tst = st[type];
            for (let t = 0; t < tst.length; t++){
                let item = tst[t];
                let {bind} = item;
                if (bind){
                    wt.add(bind);
                } else {continue};
            };
        };
        loc[id] = [...wt];
    };
    return loc[id];
};

Attrib.prototype.getWatchItemsByType = function(component, type){
    let id = `${component}-${type}`;
    let loc = Object.cache.getWatchItemsByType;
    if (!loc){
        loc = Object.cache.getWatchItemsByType = {};
    };
    if (!loc[id]){
        let st = this.st[component] || {};
        let tst = st[type] || [];
        let wt = new Set();
        for (let t = 0; t < tst.length; t++){
            let item = tst[t];
            let {bind} = item;
            switch(!!bind){
                case true:{
                    wt.add(bind);
                } break;
                default:{
                    switch(true){
                        case (type == 'animate' || type == 'toggle'):{
                            if (wt.constructor.name = "Set"){
                                wt = [];
                            };
                            wt.push(item);
                        }
                    };
                };
            };
        };
        loc[id] = [...wt];
    };
    return loc[id];
};

Attrib.prototype.getWatchItemsBySel = function(component, type, sel){
    let id = `${component}-${type}-${sel}`
    let loc = Object.cache.watchItemsBySel;
    if (!loc){
        loc = Object.cache.watchItemsBySel = {};
    };
    if (!loc[id]){
        let array = this.st[component][type];
        let find = array.find(item=>{return item.sel == sel});
        loc[id] = (find)?find:false;
    };
    return loc[id];
}
Attrib.prototype._register = function(store, f, s, obj){
    switch(true){
        case (!store[f]):{store[f] = {}};
        case (!store[f][s]):{store[f][s] = []};
        default:{store[f][s].push(obj)};
        break;
    };
};

Attrib.prototype._static = function(component){
    return function(qs, isStatic){
        let els = [];
        for(let t = 0; t < qs.length; t++){
            let el = qs[t];
            switch(isStatic){
                case false:{
                    els.push(el);
                };
                break;
                case true:{
                    let dComponent = el.closest('[data-component]');
                    dComponent = dComponent && dComponent.dataset.component;
                    switch(dComponent == component){
                        case true:{
                            els.push(el);
                        } break;
                    };
                }
                break;
                default:{continue;}
            };
        };
        return els;
    }
};

Attrib.prototype._compileEvents = function(events,component, isStatic){
    return new Promise((res)=>{
        if (!events.length) {res();return;};
        let els = this._static(component)(events, isStatic)
        if (!els.length){res();return;}
        for (let e = 0; e < els.length; e++){
            let id = `cke${this.uiid}`;
            let el = els[e];
            let splitted = el.dataset.event.split(" ").join("").split(',');
            for (let s = 0; s < splitted.length ; s++){
                let [event, cb] = splitted[s].split(':');
                cb = cb || event;
                this._register(this.st, component, 'evt', {event, sel:id, cb});
                el.dataset.event = id;
                this.uiid++;
            }
        };
        res();
    });
};

Attrib.prototype._compileToggle = function(toggles, component, isStatic){
    return new Promise((res)=>{
        if (!toggles.length){res();return;}
        let els = this._static(component)(toggles, isStatic);
        if (!els.length){res();return;}
        let c = {};
        for(let t = 0; t < toggles.length; t++){
            let id = `ckt${this.uiid}`;
            let el = toggles[t];
            let ns = el.dataset.toggle;
            

            if (c[ns]){
                id = c[ns];
            };
            this._register(this.st, component, 'toggle', {sel:id, name:'ns-'+ns});
            el.dataset.toggle = id;
            this.uiid++;
            c[ns] = id;
        };
        c = {};
        res();
    });
};
Attrib.prototype._compileFor = function(fors, component, isStatic, el){
    return new Promise((res)=>{
        let target = el;
        if (!fors.length) {res();return;};
        let els = this._static(component)(fors, isStatic);
        // console.log(component, els)
        if (!els.length){res();return;}

        let o = {};
        for (let f = 0; f < els.length; f++){
            let id = `ckf${this.uiid}`;
            let el = els[f];
            let fr = el.dataset.for;
            let [a, b, c] = fr.split(" ");
            el.style.display  = 'none';
            el.classList.add('cake-template');
            el.dataset.for = id;
            el.dataset.forTemplate = id;
            o[id] = {bind:c, sel:id, iter:a, ins: b};
            ++this.uiid;
            if (f != 0){
                let parent = el.parentElement && el.parentElement.closest('[data-for]');
                if (!parent) { continue}
                let parentIsFor = !!parent.dataset.for;
                if (target.contains(parent) && parentIsFor){
                    let parentId = parent.dataset.for;
                    let parentCf = o[parentId];
                    if (parentCf && !parentCf.children){
                        parentCf.children = [id];
                    } else if (parentCf){
                        parentCf.children.push(id);
                    };
                }
                
            };
        };
        for (let key in o){
            this._register(this.st, component, 'for', o[key]);
        };
        res();
    });
};

Attrib.prototype._compileForUpdate = function(fors, component, isStatic){
    return new Promise((res)=>{
        if (!fors.length) {res();return;};
        let els = this._static(component)(fors, isStatic);
        if (!els.length){res();return;}
        for (let f = 0; f < els.length; f++){
            let id = `ckfu${this.uiid}`;
            let el = els[f];
            let fr = el.dataset.forUpdate;
            el.style.display  = 'none';
            el.classList.add('cake-template');
            el.dataset.forUpdate = id;

            if (!el.dataset.for){
                el.dataset.forTemplate = id;
            }

            let [a, b, c] = fr.split(" ");
            this._register(this.st, component, 'forUpdate', {bind:c, sel:id, iter:a,ins: b});
            this.uiid++;
        };
        res();
    });
};

Attrib.prototype._compileSwitch = function(switchs, component, isStatic){
    return new Promise((res)=>{
        if (!switchs.length) {res();return;};
        let els = this._static(component)(switchs, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `cks${this.uiid}`;
            let el = els[s];

            let bind = el.dataset.switch, map='def';
            if (bind.includes('.')){
                var [f, ...rest] = el.dataset.switch.split('.');
                bind = f;
                map = rest[0];
            };
            el.dataset.switch = id;
            let cases = el.querySelectorAll('[data-case]');
            // console.log(cases);
            let casesId = [];
            for (let c = 0; c < cases.length; c++){
                let _case = cases[c];
                let closest = _case.closest(`[data-switch=${id}]`);


                _case.classList.add('cake-template');

                if (closest){
                    let caseBind = _case.dataset.case;
                    let _id = `cksc${this.uiid}`
                    _case.dataset.case = `${id}-${_id}`;
                    casesId.push({_id, bind:caseBind});

                    this.uiid++;
                };
            };
            this._register(this.st, component, 'switch', {bind, sel:id, map, cases:casesId});
            this.uiid++;
        };
        res()
    });
};

Attrib.prototype._compileBind = function(elModels, component, isStatic){
    return new Promise((res)=>{

        if (!elModels.length) {res();return;};
        let els = this._static(component)(elModels, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `ckm${this.uiid}`;
            let el = els[s];
            let model = el.dataset.bind;
            let gr = model.split(',');
            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                if (val.includes(':')){
                    var [attr, bind] = val.split(":");
                } else {
                    var bind = val;
                    var attr = 'value';
                };
                this._register(this.st, component, 'bind', {attr, bind, sel:id});
            }
            this.uiid++;
            el.dataset.bind = id;
        };
        res();
    });
};

Attrib.prototype._compileAnimate = function(anims, component, isStatic){
    return new Promise((res)=>{
        if (!anims.length) {res();return;};


        let els = this._static(component)(anims, isStatic);
        if (!els.length){res();return;}

        
        for (let s = 0; s < els.length; s++){
            let id = `cka${this.uiid}`;
            let el = els[s];
            let anim = el.dataset.animate;
            anim = anim.split(" ").join("");
            //to handle multiple attr binding;
            //render:appead-slideInUp, remove:disappear
            let o = {};
            let split = anim.split(',');
            for (let a = 0; a < split.length; a++){
                let item = split[a];
                let [ctx, anims] = item.split(':');
                if (ctx == 'ns'){
                    o.ns = anims;
                    break;
                } else {
                    o[ctx] = {keyframes:anims.split('-')};
                };
            };
            o.selector = {attr:'data-animate', val:id};
            this._register(this.st, component, 'animate', o);
            this.uiid++;
            el.dataset.animate = id;
        };
        res();
    });
};

Attrib.prototype._compileIf = function(ifs, component, isStatic){
    return new Promise((res)=>{
        if (!ifs.length) {res();return;};
        let els = this._static(component)(ifs, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `ci${this.uiid}`;
            let el = els[s];
            let _if = el.dataset.if;
            let gr = _if.split(',');
            for (let g = 0; g < gr.length; g++){
                let val = gr[g].split(" ").join("");
                
                let [attr, exp] = val.split('=');
                exp = exp.split(new RegExp('[()]')).join("");

                let [test, r] = exp.split('?');
                let [bind, testval] = test.split(new RegExp('<|>|===|==|!==|!='))

                let [_true, _false] = r.split(':');


                this._register(this.st, component, 'if', {attr, bind, testval:testval || null, _true, _false, sel:id});
            }
            this.uiid++;
            el.dataset.if = id;
        };
        res();
    });
};

Attrib.prototype._compileClass = function(cls, component, isStatic){
    return new Promise((res)=>{

        if (!cls.length) {res();return;};
        let els = this._static(component)(ifs, isStatic);
        if (!els.length){res();return;}
        for (let s = 0; s < els.length; s++){
            let id = `cc${this.uiid}`;
            let el = els[s];
            let cl = el.dataset.class;
            let [test, className] = cl.split('&&');
            test = test.trim();
            let [bind, ops, testVal] = test.split(" ");
            let hasNegate = bind.substring(0,1);
            hasNegate && (bind = bind.slice(1));
            this._register(this.st, component, 'class', {hasNegate, bind, testVal,className, ops, sel:id});
            this.uiid++;
            el.dataset.class = id;
        };
        res();
    });
};

Attrib.prototype.inject = function(el, component, isStatic=false){
    // console.trace()
    // console.time(`inject ${component}`)
    // this.st.component = new RAM('for', new RAM());


    return new Promise((res)=>{
        let query = el.getElementsByDataset('bind', 'for', 'for-update', 'switch', 'toggle', 'event', 'animate','if','class');
        // console.log(query, component);
        res(query);
    }).then((query)=>{
        let r = [];
        let map = {
            'bind':this._compileBind,
            'for':this._compileFor,
            'for-update':this._compileForUpdate,
            'switch':this._compileSwitch,
            'toggle':this._compileToggle,
            'event':this._compileEvents,
            'animate':this._compileAnimate,
            'if':this._compileIf,
            'class':this._compileClass,
        };

        for (let q in query){
            if (query[q].length){
                r.push(map[q].apply(this, [query[q], component, isStatic, el]));
            };
        };
        
        console.timeEnd(component);
        return (r.length)?Promise.all(r):Promise.resolve();
    }).then(()=>{
        return this.store.createOrUpdate(component, this.st[component]);
    });


    
};

;class Mo{
    constructor(config=[],html){
        this.html = html || document;
        this.cf = config;
        this.duration = 300;
    }
    animate(moment){
        this.config = this.parse(this.cf);

        return new Promise((res)=>{
            for (let i = 0; i < this.config.length; i++){
                let cf = this.config[i];
                // console.log(cf)

                let {element} = cf;
                //when there is no config for certain moment, render || remove
                //safekeep
                if (!cf[moment]){ res();break;};
                let config = cf[moment];
                if (!config.options && !(config.options && config.options.duration)){
                    config.options = {duration : this.duration};
                };
                if (!config.keyframes && !element){continue;}

                let keyframes = config.keyframes;
                let index = 0;
                let fr = [];
                for (let k = 0; k < keyframes.length; k++){
                    let kk = keyframes[k];
                    switch(true){
                        case typeof kk == 'string':{
                            fr.push(this.dic(kk));
                        } break;
                        case (kk instanceof Object):{
                            //maybe the offset is declared along with the keyframes;
                            //name - refers to default animation
                            let {name, offset} = kk;
                            if (name && offset){
                                //support for element.animation - offset, equivalent to 10%-100% css @keyframes;
                                let def = this.dic(name);
                                def[def.length-1].offset = offset;
                                fr.push(def);
                            } else {
                                fr.push(kk)
                            }
                        }
                    };
                }
                keyframes = fr;
                fr = null;
                //to series calls of animation, one after the another;
                // console.log(element, keyframes, config);
                let recurseCall= ()=>{
                    let kf = keyframes[index];
                    let animate = element.animate(kf, (config.options || this.duration));
                    animate.finished.then(()=>{
                        if (index < keyframes.length -1){
                            index += 1;
                            recurseCall()
                        } else {
                            keyframes = [];
                            // console.log(index, keyframes.length)
                            res();
                        }
                    });
                }; recurseCall();
            };
        });
    }
    parse(config){
        let configs = [], length = config.length, i = -1;
        // console.log(config);
        while(++i < length){
            let cf = config[i];
            let selector = cf.selector, el;
            
            switch(true){
                case !!(selector.val && selector.attr):{
                    el = this.html.querySelectorIncluded(`[${selector.attr}=${selector.val}]`, selector.attr, selector.val);
                } break;
                case !!(selector.val && !selector.attr):{
                    let attr = selector.val.match(new RegExp(`^[.]`))?'class':
                    selector.val.match(new RegExp(`^[#]`))?'id':null;
                    let val = (attr)?selector.val.slice(1):null;
                    el = this.html.querySelectorIncluded(selector.val, attr, val);
                } break;
            };
            cf.element = el;
            configs.push(cf);
        };
        // console.log(configs);
        return configs;
    }
    dic(name){
        let coll = {
            slideOutUp:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideOutRight:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideOutLeft:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(-100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideOutDown:[{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            },{
                transform: "translate3d(0,-100%,0)",
                visibility: "hidden",
                opacity: "0"
            }],
            slideInUp:[{
                transform: "translate3d(0,100%,0)",
                visibility: "hidden",
                opacity: "0"
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            slideInRight:[{
                transform: "translate3d(100%,0,0)",
                visibility: "hidden",
                opacity: "0"
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            slideInLeft:[{
                transform: "translate3d(-100%,0,0)",
                visibility: "hidden",
                opacity: "0",
                easing:'ease-out',
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            slideInDown:[{
                transform: "translate3d(0,-100%,0)",
                visibility: "hidden",
                opacity: "0"
            },{
                transform: "translate3d(0,0,0)",
                visibility: "visible",
                opacity: "1"
            }],
            disappear:[{
                opacity: "1"
            },{
                opacity: "0"
            }],
            appear:[{
                opacity: "0"
            },{
                opacity: "1"
            }],
            flipInX:[
                ,{offset:0, backfaceVisibility: "visible"}
                ,{transform: "perspective(400px) rotate3d(1,0,0,90deg)",opacity: "0", offset:0}
                ,{transform: "perspective(400px) rotate3d(1,0,0,-20deg)", offset: 0.4,easing:'ease-in'}
                ,{offset:0.6,  opacity: "1",transform: "perspective(400px) rotate3d(1,0,0,10deg)"}
                ,{transform: "perspective(400px) rotate3d(1,0,0,-5deg)", offset:0.8}
                ,{offset:1, backfaceVisibility: "visible",transform: "perspective(400px) rotate3d(1,0,0,0)"}
            ],
        };
        return coll[name.trim()] || [];
    }
};


(function(global){

    function Scope(parent, options){
        this.pKey = options.pKey || '$scope';
        this.temp = {};
        this.trap = options.trap;
        this.notify = [];
        this.parent = parent;
        this._clone = {};
        this.install();
    }; 
    
    
    Scope.prototype.registerNotifier = function(fn){
        this.notify.push(fn);
    };
    Scope.prototype.notifier = function(obj){
        // console.log(obj);
        Cakes.$scope[obj.bind] = obj.value;
    };
    Scope.prototype.method = function(){
        let temp = this.temp;
        let trap = this.trap;
        let notify = this.notify;
        let _this = this.parent;
        
        return {
            update(keys, fn){
                if (!keys.length) return;
                for (let k = 0; k < keys.length; k++){
                    let key = keys[k];
                    fn(key);
                };
            },
            defineProperty(key, cloned){
                Object.defineProperty(temp, key, {
                    configurable:true,
                    get(){
                        let t = trap.bind(_this)(key) || false;
                        if (t){
                            return t;
                        };
                        // return get(key);
                        
                        return cloned[key];
                    },
                    set(newValue){
                        if (key == 'extend'){
                        } else {
                            // console.log(newValue)
                            let prevValue = this[key];
                            for (let n = 0; n < notify.length; n++){
                                let fn = notify[n];
                                fn(key, newValue, prevValue);
                            };
                            
                            cloned[key] = newValue;
                            // set(key, value);
                        }
                    },
                });
            }
        };
    };
    Scope.prototype.install = function(){
        let {update, defineProperty} = this.method();
        let temp = this.temp;
        let cloned = this._clone;
        Object.defineProperty(this.parent, this.pKey, {
            configurable:true,
            get(){
                cloned = Object.assign(cloned, temp);
                let keys = Object.keys(temp);
                update(keys, function(key){
                    defineProperty(key, cloned);
                });
                return temp;
            },
        });
    };
    
    Scope.prototype.watch = function(array){
        // console.log(array)
        // console.trace();
        if (!array) return;
        let {update, defineProperty} = this.method();
        let cloned = this._clone;
        update(array, function(key){
            defineProperty(key, cloned);
        });
        return true;
    };
    
    global.Scope = Scope;    
})(window);



(function(global){
    function Observer(subscribe, handlers, logger){
        this.subscribe = subscribe;
        this.handlers = handlers;
        this.logger = logger || false;
        // this.subscribe = {};
    
        this.stat = {
            handlers:{},
            subscribe:{},
        };
        this.results = {};
    
        this.wm = new WeakMap();
    }
    Observer.prototype.notify = function(component, /*handler- name/fn*/event, e/*payload */, filter, ispage, appName){
        /*
            calls by fire or DOM event;
            DOM Event - string;
            fire - string || fn;
        */
    
           
    
        function engrave(){
            return {
                _component:component, _event:event, _e:e,
            }
        };
    
        function ret(handler){return handler};
    
        let {_component, _event, _e} = engrave();
    
        let handler = this.handlers[_component] && this.handlers[_component][_event];
        if (handler == undefined && ispage){
            let o = {
                [_event]:function(){
                    return _e;
                }
            };
            o[_event].binded = _component;
            o[_event].listenTo = appName;
            handler = o[_event];
        };
    
    
        _component = handler.binded;
    
    
        handler = ret(handler);    
    
        // console.log(_component, _event, handler);
    
        if (!handler) {
            console.error(`no setup handler for the event ${_event} in ${_component} component`);
            return;
        };
        // if (_component == 'main-section'){
        //     console.log(_event, _component);
        // }
        //it is able to accept a promise from handlers;
    
        let prom = new Promise((res,rej)=>{
            let e = handler(_e);
            res(e);
        })
    
        this.stat.handlers[handler.original] += 1;
    
        return prom.then(variable=>{
            // console.log(variable, _component);
            let execs = []; 
    
            if (!this.results[_component]){
                this.results[_component] = {};
            };
    
            
    
            if (this.subscribe[_component] && this.subscribe[_component][_event]){
                let subscribe = this.subscribe[_component][_event];
                
      
                // console.log(_component, _event, subscribe)
                filter = !filter?true:(()=>{
                    subscribe = subscribe.filter(fn=>{
                        let binded = fn.binded;
                        return filter.includes(binded)
                    });
                })();
    
                for (let s = 0; s < subscribe.length; s++){
                    let fn = subscribe[s];
                    // console.log(_component, fn.original)
    
                    
                    // if (_component == 'header'){
                    //     console.log(fn)
                    // }
                    this.stat.subscribe[fn.original] += 1;
                    
                    execs.push(new Promise((res, rej)=>{
                        try{
                            let exec = fn(variable);
                            if (exec && exec.toString().includes('Promise')){
                                 exec.then(result=>{
    
                                    if (!this.results[_component]){
                                        this.results[_component] = {};
                                    };
                                    this.results[_component][_event] = exec;
    
                                    res();
    
                                 }).catch(err=>{
                                    //  console.log(exec, fn.original);
                                     rej(err);
                                    //  res(err.message)
                                 });
                            } else {
                                // console.log(exec);
    
                                this.results[_component][_event] = exec;
                                res();
                            }
                        } catch(e){
                            console.log(e);
                            rej(e);
                        };
                    }));
                };
            } else {
                if (this.logger) {
                    console.info(`no subscriber for (${_event}) event of (${_component}) component`);
                };
                
                this.results[_component][_event] = variable;
    
            };
            
            return Promise.all(execs).then(()=>{
                variable = null;
            });
        });
    
    };
    Observer.prototype.registerSubscribe = function(subscribe){
        // console.log(subscribe)
        new Promise((res, rej)=>{
            for(component in subscribe){
                if (!this.subscribe[component]){
                    this.subscribe[component] = {};
                } else { continue};
            };
            res();
        }).then(()=>{
            let obj = {};
            for(component in subscribe){
                let events = subscribe[component];
                for (let name in events){
                    let arr = events[name];
                    for (let f = 0; f < arr.length; f++){
                        let handler = arr[f]
                        if (!obj[component]){
                            obj[component] = {};
                        };
                        if (!obj[component][handler.original]){
                            obj[component][handler.original] = [];
                        };
                        obj[component][handler.original].push(handler);
                        this.stat.subscribe[handler.original] = 0;
                    };
                };
            };
            return obj;
        }).then((obj)=>{
            for (let component in obj){
                if (!this.subscribe[component]){
                    this.subscribe[component] = {};
                };
                for (let event in obj[component]){
                    for (let handler of obj[component][event]){
                        if (!this.subscribe[component][handler.original]){
                            this.subscribe[component][handler.original] = [];
                        };
                        this.subscribe[component][handler.original].push(handler);
                    };
                };
            };
            obj = {};
            Object.assign(Cakes.Subscribe, this.subscribe);
        });
    };
    
    Observer.prototype.registerHandlers = function(handlers, component){
        if (!this.handlers[component]){
            this.handlers[component] = {};
        };
        for (let fn in handlers){
            let handler = handlers[fn];
            this.handlers[component][fn] = handler;
            this.stat.handlers[handler.original] = 0;
        };
    };

    global.Observer = Observer;
})(window);

;class Persistent{
    constructor(){
        this.storage = new StorageKit({
            storage:sessionStorage,
            name:'_cake_persistent',
            id:false,
        });
    }
    listen(components){
        // console.log(components)
        window.addEventListener('DOMContentLoaded', (e)=>{
            setTimeout(()=>{
                this.storage.getAll().then(result=>{
                    if (!result.length) return;
                    // console.log(result);
                    for (let r = 0; r < result.length; r++){
                        let item = result[r];
                        let component = components[item];
                        
                        if (component){
                            !component.isConnected && component.render.bind(component)();
                        } else {
                            console.error(`component ${component} is not found!`)
                        }
                    };
                })
            })
        });
    }
    append(name){
        this.storage.create(name);
    }
    remove(name){
        this.storage.remove(name);
    }
};

//it extends the user interaction to close button;
//it uses the back button to close a certain ui;
//the ui is renderedAsync, with option of hash;
//so that it can be close using the back button;

class Hasher{
    constructor(Components){
        this.Components = Components;

    }
    listen(){
        window.addEventListener('hashchange',(e)=>{
           //when rendered add will be called;
           //when removed remove will be called;
           //here whem removed is called;
           //the component will get notified; 
           

           //compare from prev get the missing in current from prev;
           let hit = this.compare(e);
           this.find(hit, this.notify);
        });
    }
    compare(e){
        //the comparison will work only in remove;
        //since, the renderAsync will handle it;
        let {oldURL, newURL} = e;
        let hit = null; 
        if (oldURL.length > newURL.length){
            let prev = new URL(oldURL).hash.substring(1).split('/');
            let next = new URL(newURL).hash.substring(1).split('/');
             
            for (let p = 0; p < prev.length; p++){
                if (!next.includes(prev[p])){
                    hit = prev[p];
                    break;
                };
            };
        }; 
        return hit;
    }
    find(name, cb){ 
        if (!name) return;
 
        if (!this.Components[name]){
            let lk = setInterval(()=>{
                
                if (this.Components[name]){
                    if(this.Components[name].isConnected){
                        cb(this.Components[name]);
                    };
                    clearTimeout(lk);
                };
            },50);
            //loophole catcher;
            setTimeout(()=>{
                clearTimeout(lk);
            },5000);
        } else {
            if(this.Components[name].isConnected){
                cb(this.Components[name]);
            };
        };
    }
    notify(component){
        component.fire.destroy();
    }
    add(componentName){
        let hash = location.hash;
        if (!hash.includes(componentName)){
            location.hash = hash+'/'+componentName;
        };
    }
    remove(componentName){
        let hash = location.hash
        let removed = hash.replace(componentName, "");
        location.replace(removed);
    }
};

;(function(global){
    function Piece(el){
        this.el = Piece.toArray(el);
    };
    Piece.toArray = function(el){
        let r = [];
        switch(true){
            case (el instanceof Array):{
                r = el;
            } break;
            case (el.length && (el.tagName && el.tagName != 'FORM') && !(el instanceof Array)):{
                for (let e = 0; e < el.length; e++){
                    r.push(el[e]);
                };
            } break;
            case !(el instanceof Array):{
                r = [el];
            } break;
        };
        return r;
    }
    Piece.prototype.getElements = function(){
        return this.el;
    };
    Piece.prototype.getElement = function(){
        return this.el[0];
    };
    Piece.prototype.remove = function(name){
        let i = -1, length = this.el.length;
        let fg = document.createDocumentFragment();
        while(++i < length){
            let el = this.el[i];
            el  && (fg.appendChild(el));
            // el  && el.remove();
        };
        fr = null;
    };
    
    Piece.prototype.replaceDataSrc = function(){
        let els = this.el[0];
        let srcs = els.querySelectorAll('[data-src]');
        for (let s = 0; s < srcs.length; s++){
            el = srcs[s];
            el.setAttribute('src', el.dataset.src);
            el.removeAttribute('data-src');
        };
    };
    
    Piece.cloneNode = function(el){
        el = (el instanceof Array)?el:this.toArray(el);
        let a = [];
        for (let e = 0; e < el.length; e++){
            a.push(el[e].cloneNode(true));
        };
        return new Piece(a);
    };
    Piece.prototype.getContainers = function(){
        let query = this.querySelectorAll(`[data-container]`).toArray();
        // console.log(query)
        if (this.dataset.container){
            console.log(this);
            query.push(this);
        };
        return query;
    };
    Piece.prototype.cloneNode = function(el){
        el = this.el;
        return Piece.cloneNode(el);
    };
    Piece.prototype.getAllElements = function(){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].getElementsByTagName('*').toArray();
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.getElementsByTagName('*');
                    if (q){
                        for (let i = 0; i < q.length; i++){
                            r.push(q[i]);
                        };
                    };
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.appendTo = function(root, cleaned){
        if (!root && !root.attributes){
            throw new TypeError(`the ${root} is not an instance of Element`);
        };
        cleaned && (root.innerHTML = "");
        for (let i = 0; i < this.el.length; i++){
            let el = this.el[i];
            root.appendChild(el);
        };
    };
    Piece.prototype.getElementsByTagName = function(tag){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].getElementsByTagName(id).toArray();
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.getElementsByTagName(selector);
                    if (q){
                        for (let i = 0; i < q.length; i++){
                            r.push(q[i]);
                        };
                    };
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.getElementById = function(ids){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].getElementById(id);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelector(selector);
                    if (q){
                        r.push(q);
                    };
                };
            } break;
        };
        return r;
    }
    
    Piece.prototype.querySelectorAll = function(selector){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelectorAll(selector);
            } break;
            case length > 1:{
                let els = [];
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorAll(selector);
                    q && (r = r.concat(q.toArra()));
                };
            } break;
            default:{
                r = [];
            }
        };
        return r;
    };
    
    Piece.prototype.querySelector = function(selector){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelector(selector);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelector(selector);
                    if (q){
                        r.push(q);
                    };
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.querySelectorIncluded = function(selector, attr, val){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelectorIncluded(selector, attr, val);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorIncluded(selector, attr, val);
                    q && (r.push(q))
                };
            } break;
        };
        return r;
    };
    
    
    Piece.prototype.querySelectorAllIncluded = function(selector, attr, val){
        let length = this.el.length;
        let r = [];
        switch(true){
            case length == 1:{
                r = this.el[0].querySelectorAllIncluded(selector, attr,val);
            } break;
            case length > 1:{
                let i = -1;
                while(++i < length){
                    let el = this.el[i];
                    let q = el.querySelectorAllIncluded(selector, attr, val);
                    q && (r = r.concat(q.toArra()));
                };
            } break;
        };
        return r;
    };
    
    Piece.prototype.contains = function(el){
        let length = this.el.length, test = false;
        switch(length == 1){
            case true:{
                test = this.el[0].contains(el);
            } break;
            case false:{
               let index = -1;
               while(++index < length){
                   let _el = this.el[index];
                   if (_el.contains(el)){
                    test = true;
                    break;
                   };
               };
            } break;
        }
        return test;
    }
    
    Piece.prototype.dataset = function(data, cb){
        let l = this.el.length;
        let i = -1;
        while(++i < l){
            if (this.el[i].dataset[data]){
                cb(this.el[i]);
            };
        };
        return true;
    }
    
    Piece.prototype.getElementsByDataset = function(){
        let arg, sel, i, a, el, query;
        arg = arguments;
        o = {};
        length = arg.length;
        i = -1;
        a = -1;
        while(++i < this.el.length){
            el = this.el[i];
            while(++a < length){
                sel = arg[a];
                if (el.getAttribute(`data-${sel}`)){
                    o[sel] = [el];
                } else {
                    o[sel] = [];
                }
                query = el.querySelectorAll(`[data-${sel}]`);
                if (query.length){
                    o[sel] = o[sel].concat([...query]);
                };
            };
        };
        return o;
    }
    global.Piece = Piece;
})(window);

(function(global){
    HTMLCollection.prototype.toArray = function(){
        let b = [];
        for (let a = 0; a < this.length ;a++){
            b[a] = this[a];
        }
    
        return b;
    };
    NodeList.prototype.toArray = function(){
        
        let b = [];
        let index = -1;
        let length = this.length;
        while(++index < length){
            b[index] = this[index];
        };
        // console.trace();
        // console.log(b);
        return b;
    };
    Object.cache = Object.create(null);
    
    String.prototype.toHyphen = function(){
        let _StringCache = Object.cache;
        let cvt = null;
        let str = this;
        switch(true){
            case !_StringCache.toHyphen:{
                _StringCache.toHyphen = {};
            }
            case true:{
                _StringCache = _StringCache.toHyphen;
            }
            case _StringCache[str]:{
                cvt = _StringCache[str];
            }
            case true:{
                if (cvt != undefined){
                    return cvt;
                };
                let splitted = str.split('');
                // console.log(splitted)
                let ss = "", i = -1;
                while (++i < splitted.length){
                    let s = splitted[i];
                    switch(i){
                        case 0:{
                            ss += s.toLowerCase();
                        } break;
                        default:{
                            s.charCodeAt() < 91 && (ss += '-');
                            ss += s.toLowerCase();
                        }
                    }
                };
                _StringCache[str] = ss;
                cvt = ss;
            }
        };
        return cvt;
    };
    
    String.prototype.toCamelCase = function(){
        let str = this.toLowerCase();
        let _StringCache = Object.cache;
        let cvt =null;
        switch(true){
            case !_StringCache.toCamel:{
                _StringCache.toCamel = {};
            }
            case true:{
                _StringCache = _StringCache.toCamel;
            }
            case _StringCache[str]:{
                cvt = _StringCache[str];
            }
            break;
            default:{
                let split = str.split('-');
                if (split.length == 1){
                    return str;
                };
                let join = "";
                let i = -1;
                let length = split.length;
                while (++i < length){
                    let str = split[i];
                    switch(i){
                        case 0:{join += str};
                        default:{
                            let first = str.substring(0,1).toUpperCase();;
                            let second = str.substring(1);
                            join += (first+second);
                        } break;
                    }
                };
                _StringCache[str] = join;
                cvt = join;
            } break;
        };
        return cvt;
    };
    
    HTMLElement.prototype.querySelectorIncluded = function(selector, attr, val){
        let q = this.querySelector(selector);
        return (q)?q:(()=>{
            switch (true){
                case !attr && !val:{
                    let qu = this.closest(selector);
                    if (qu == this){
                        q = qu;
                    };
                };
                break;
                case !!attr && !!val:{
                    
                    q = this.getAttribute(attr) == val?this:null;
                };
                break;
                case !!attr && !val:{
                    q = this.getAttribute(attr)?this:null;
                }
                break;
            };
            return q;
        })();
    };
    
    HTMLElement.prototype.querySelectorAllIncluded = function(selector, attr, val){
        let q = this.querySelectorAll(selector).toArray();
        switch (true){
            case !attr && !val:{
                let qu = this.closest(selector);
                qu == this && q.push(qu);
            };
            break;
            case attr && val:{
                this.getAttribute(attr) == val && q.push(this);
            };
            break;
            case attr && !val:{
                this.getAttribute(attr) && q.push(this);
            }
            break;
        };
        return q;
    };
    
    HTMLDocument.prototype.querySelectorIncluded = function(selector){
        return this.querySelector(selector);
    };
    
    HTMLDocument.prototype.querySelectorAllIncluded = function(selector){
        return this.querySelectorAll(selector);
    };
    
    
    
    Array.prototype.toggler = function(dataName, activeClass){
        for (let t = 0; t < this.length; t++){
            let node = this[t];
            let name = node.dataset.name;
            if (name == dataName){
                node.classList.toggle(activeClass);
            } else {
                if (node.classList.contains(activeClass)){
                    node.classList.toggle(activeClass);
                };
            };
        };
    };
    
    HTMLElement.prototype.Ref = function(){
        let n = '_cakes_storage';
        !this[n] && (this._cakes_storage = {})
        let storage = this[n];
        return {
            set(key, value){
                storage[key] = value;
            },
            get(key){
                return storage[key];
            },
            getAll(key){
                return storage;
            },
            remove(key){
                delete storage[key];
            }
        }
    }
    
})(window);

// function StorageKit(obj){
//     this.name = obj.name;
//     this.id = obj.id || '_id';
//     this.parent = obj.parent || {};
//     this.child = obj.child;
// };

;(function(global, factory){
    global.StorageKit = factory();
})(this, function(){
    //in-memory
    window._storage_kit = {};


    class $storageArray{
        constructor(_id){
            this.id = _id;
        }
        has(db, data){
            if (this.id){
                //obj;
                var index = db.findIndex(item=>{
                    return item[this.id] == data[this.id];
                });
            } else {
                //string
                var index = db.findIndex(item=>{
                    return item == data;
                });
            };
            return (index == -1)?false:index+1;
        }
        create(db, _data){
            let has = this.has(db, _data);
            if (has){
                return false;
            } else {
                db.push(_data);
                return true;
            };
        }
        createOrUpdate(db, data){

            let has = this.has(db, data);
            if (has){
                db[has-1] = data;
            } else {
                db.push(data);
            };
            return !!has;
        }
        get(db, q){
            let query = [];
            let hasID = !!this.id;

            for (let d = 0; d < db.length; d++){
                let item = db[d];
                if (q instanceof Array){
                    for(let a = 0; a < q.length; a++){
                        let e = q[a];
                        if (hasID){
                            if (e == item[this.id]){
                                query.push(item);
                            }
                        } else {
                            if (e == item){
                                query.push(item);
                            };
                        }
                    };
                };
            };
             
            if (query.length){
                return query; 
            };
             
            return !!query.length;
        }
        update(db, data){
            let has = this.has(db, data);
            if (has){
                db[has-1] = data;
                return db;
            } else {
                return !!has;
            };
        }
        remove(db, r){
            let filtered = [];
            let hasID = !!this.id;
            for (let d = 0; d < db.length; d++){
                let item = db[d];
                if (r instanceof Array){
                    for (let a = 0; a < r.length; a++){
                        let e = r[a];
                        if (hasID){
                            if (e != item[this.id]){
                                filtered.push(item);
                            }
                        } else {
                            if (e != item){
                                filtered.push(item);
                            };
                        };
                    };
                };
            };
             
            return filtered;
        }
    }
    class $storageObject{
        constructor(_id){
            this.id = _id;
        }

    }

    function instanceOf(item, con){
        return item instanceof con;
    }

    class $storageConnection{
        constructor(obj){
            this.name = obj.name;
            this.storage = obj.storage;
            this.storageType = 'storage';
            this.child = obj.child || [];
            this.id = (obj.id == false)?null:obj.id || '_id';
            
            
                let storage = this. storage;
                if (storage == 'memory'){
                    this.storage = window._storage_kit;
                    this.storageType = 'object';
                } else if (storage == 'session'){
                    this.storage = sessionStorage;
                } else if (storage == 'local'){
                    this.storage = localStorage;
                };
                let child = this.child;
  
                if (child instanceof Array){
                    this.childType = 'array';
                } else if (child instanceof Object){
                    this.childType = 'object';
                };
            this.open();
        }
        open(){
            if (this.storageType == 'storage'){
                if (!this.storage[this.name]){
                    this.storage.setItem(this.name, JSON.stringify(this.child));
                };
                return JSON.parse(this.storage.getItem(this.name));
            } else if (this.storageType == 'object'){
                if (!this.storage[this.name]){
                    this.storage[this.name] = this.child;
                };
                return this.storage[this.name];
            };
        }
        close(db){
            if (this.storageType == 'storage'){
                this.storage.setItem(this.name, JSON.stringify(db));
            } else if (this.storageType == 'object'){
                this.storage[this.name] = db;
            };
        }
    };

    class $storage extends $storageConnection{
        constructor(obj){
            super(obj);
            if (this.childType == 'array'){
                this.method = new $storageArray(this.id);
            } else if (this.childType == 'object'){
                this.method = new $storageObject(this.id);
            };
        }
        create(_item){
            let args = arguments, obj = {};
            if (args.length == 1){
                let arg = args[0];
                if (this.id){
                    //it must be an object;
                    if (typeof arg == 'object' && (arg).toString().includes('Object')){
                        if (!arg[this.id]){
                            throw new Error(`no id given or the format must be ${this.id}`);
                        };
                        obj = arg;
                    } else {
                        throw new Error(`this data ${JSON.stringify(arg)} must be an object`);
                    };
                } else {
                    if (typeof arg == 'string'){
                        obj = _item;
                    };
                };
            } else if (args.length == 2){
                let [key, value] = args;
                obj = {[this.id]:key, [key]:value};
            };
            let db = this.open();
            this.method.create(db, obj);
            this.close(db);
        }
        createOrUpdate(item){
            let args = arguments, obj = {};
            // console.log(args)
            if (args.length == 1){
                let arg = args[0];
                if (this.id){
                    //it must be an object;
                    if (typeof arg == 'object' && (arg).toString().includes('Object')){
                        if (!arg[this.id]){
                            throw new Error(`no id given or the format must be ${this.id}`);
                        };
                        obj = arg;
                    } else {
                        throw new Error(`this data ${JSON.stringify(arg)} must be an object`);
                    };
                } else {
                    if (typeof arg == 'string'){
                        obj = _item;
                    };
                };
            } else if (args.length == 2){
                let [key, value] = args;
                obj = {[this.id]:key, [key]:value};
            };
            let db = this.open();
            this.method.createOrUpdate(db, obj);
            this.close(db);
        }
        get(){
            let args = arguments;
            var q = [];
            for (let i = 0; i < args.length; i++){
                q.push(args[i]);
            };


            return new Promise((res, rej)=>{
                let db = this.open();
                let query = this.method.get(db, q);
                res && res(query);
            });
        }
        getAll(){
            return new Promise((res)=>{
                let db = this.open();
                res && res(db);
            });
        }
        update(data){
            let db = this.open();
            this.method.update(db, data);
            this.close(db);
        }
        remove(){
            let args = arguments;
            var r = [];
            for (let i = 0; i < args.length; i++){
                r.push(args[i]);
            };

            let db = this.open();

            let removed = this.method.remove(db, r);
            this.close(removed);
        };
    }

    return $storage;

});


;(function(global, factory){

    global.Formy = factory();
})(window, function(){

    function FormyClass(){
        let component = this;
        // console.log(component);
        // if (!component.await.$form){
        //     component.await.$form = {};
        // }
        this.$form = {};
        this.$form.options = (obj, isgroup)=>{
            let {options, params} = obj;
            if (!options) { options = [] };
            // console.log(options);
            let prom = Promise.all(options.map(item=>{
                let {control, field, tbl, src, schema} = item;
                // console.log(schema)
                let o = {
                    [src]:function(){ return {tbl, field, params}},
                };
                return component.fire(o[src]).then((opts)=>{
                    opts = opts || [];
                    item.query = opts;

                    opts = opts.map(item=>{
                        return schema(item);
                    });

                    /**appending empty option */
                    let scheme = schema({});
                    for (let key in scheme){
                        scheme[key] = "";
                    };
                    opts.unshift(scheme);
                    /**end */

                    // console.log(opts);
                    item.options = opts;
                    return item;
                })
            })).then((result)=>{
                
                if (isgroup){
                    //include config;
                    return result.reduce((accu, iter)=>{
                        let {type, control} = iter;
                        if (!type){
                            type = 'select';
                        };

                        if (!accu[type]){
                            accu[type] = {};
                        };

                        if (!accu[type][control]){
                            accu[type][control] = iter;
                        };
                        

                        return accu;
                    }, {});
                } else {
                    return result.reduce((accu, iter)=>{
                        accu[iter.control] = iter.options;
                        return accu;
                    }, {});
                };
            }).catch(err=>{
                console.error(err);
            });

            // component.await.$form.options = prom;
            return prom;
        };
        this.$form.plot = (config)=>{
            let {data, container} = config;
            if (!data && !container) { return };
            const query = (root, selector, callback)=>{
                if (!root){
                    console.info('root is not provided!');    
                    return ;
                }
                const els = root.querySelectorAll(`${selector}`);
                const len = els.length;
                if (!len){
                    callback(null, data);
                    return;//exit;
                }
                for (let e = 0; e < len; e++){
                    let el = els[e];
                    let name = el.name;
                    let value = data[name];

                    let r = callback(el, value, e);
                    if (r == 'break'){break; };
                    if (r == 'continue'){ continue; };
                };
            };

            query(container, 'INPUT.input', function(el, value){
                if (value != undefined){
                    if (el.type == 'date'){
                        value = new Date(value) == 'Invalid Date'?"":new Date(value).toJSON().split('T')[0];
                        el.value = value;
                    } else {
                        el.value = value;
                    }
                };
            })

            setTimeout(()=>{
                query(container, 'SELECT.input:not(.cake-template)', function(select, value){
                    // console.log(select);
                    query(select, 'OPTION:not(.cake-template)', function(option, _value, index){
                        // console.log(option)
                        if (option){
                            if (option.value == value){
                                select.selectedIndex = index;
                                return 'break';
                            };
                        } else {
                            // console.trace();
                            // console.log(_value);
                            console.log(option, _value, 'provide schema')
                            //provide schema
                        }
                    });
                });
            }, 500);

            return Promise.resolve();

        }
    };



    return FormyClass;
});

;(function(){
    customElements.define('sub-template',
  class extends HTMLElement {
    constructor() {
      super();
  	}
    connectedCallback(){
        this.replace(this);
    }
    replace(subTemplate){
        let ref = subTemplate.dataset.template;
        let refEl = document.getElementsByName(ref);
        
        
        if (refEl.length > 1){
            console.error(`template with name ${ref} has more than one reference.`)
            return ;
        };
        if (!refEl){
            subTemplate.remove();
            throw new Error(`${ref} is not found!`);

        };
        if (refEl[0]){
            let temp = refEl[0];
            if (temp.constructor.name == "HTMLTemplateElement"){
                temp = temp.content.cloneNode(true).firstElementChild;
                if (!temp) {return;};
                let attrs = subTemplate.attributes;
                for (let a = 0; a < attrs.length ;a++){
                    let attr = attrs[a];
                    if (attr.name != 'data-template'){
                        temp.setAttribute(attr.name, attr.value);
                    };
                };
                // console.log(temp);
                subTemplate.replaceWith(temp);
            } else {
                throw new Error(`${ref} is not referred to a Template Element!`);
            };
        };
    }
});
HTMLTemplateElement.prototype.replaceSubTemplate = function(el){
    let subTemplates = el.getElementsByTagName('sub-template');
    if (subTemplates){
        subTemplates = subTemplates.toArray();
        for (let s = 0; s < subTemplates.length; s++){
            let subTemplate = subTemplates[s];
            customElements.get('sub-template').prototype.replace(subTemplate);
        };
    };
}
HTMLTemplateElement.prototype.collectContent = function(){
    let template = this;
    let cf = null;
    let temp =template.cloneNode(true);
    let fr = document.createDocumentFragment();
    let styles = temp.content.querySelector('style');
    if (styles){
        fr.appendChild(styles);
    }
    let others = [];
    for (let o = 0; o < temp.content.children.length; o++){
        let el = temp.content.children[0];
        this.replaceSubTemplate(el);
        others.push(el);
    }
    cf = {style:fr.children[0], others}
    return cf; 
};
HTMLTemplateElement.prototype.parseStyle = function(style){
    if (!style) return false;
    var styles = style.textContent;
    styles = styles.replace(/\s/g, '')
    if (!styles.length) { return;}
    let isSelector = false;
    let isOpen = false;
    let isClose = false;
    let splitted = styles.split("");
    let selector = "";
    styles = "";
    var obj = false;
    for (let l = 0; l < splitted.length; l++){
        let cha = splitted[l];
        if (cha == '{'){
            isSelector = true;
            isOpen = true;
        };
        if (cha == '}'){
            isSelector = false;
            isOpen = false;
        };
        if (!isSelector && cha != '\t' && cha != '}' && cha != " " && cha != ';'){
            selector += cha;
        };
        if (isOpen && cha != '\t' && cha != '{' & cha != " "){
            styles += cha;
        };
        if (cha == '}'){
            if (!obj){
                obj = {};
            };
            obj[selector] = styles;
            selector = "";
            styles = "";
        };
    };
    return obj;
};

HTMLTemplateElement.prototype.parseHTML = function(others){
    if (others){
        var parent = document.createElement('HTML');
        for (let o = 0; o < others.length; o++){
            let other = others[o];
            parent.append(other);
        };
    };
    return parent || false;
};

HTMLTemplateElement.prototype.getContent = function(isConvert){
    let {style, others} = this.collectContent()
    let styles = this.parseStyle(style);
    let element = this.parseHTML(others);


    for (let selector in styles){
        // console.log(element.outerHTML)
        let query = element.querySelectorAll(selector);
        let css = styles[selector];
        for (let q= 0; q < query.length; q++){
            let item = query[q];
            // console.log(item, css)
            item.setAttribute('style', css);
            // console.log(item);
        };
    };
    element = (isConvert)?element.children.toArray():element.innerHTML;
    return (element.length == 1)?element[0]:element;
};
})();


;(function(global){
    function Templating(data, template, isConvert){
        this.data = data;
        this.template = template;
        this.isConvert = isConvert;
    };
    Templating.prototype._getTag = function(template){
        //get the tag in < h1>;
        return template.match(new RegExp('(?<=<)|([^/s]+)(?=\>)', 'g'))[2];
    };
    Templating.prototype._bindReplace = function(obj,string){
        for (let key in obj){
            let pattern = new RegExp(`{{${key}}}`, 'g');
            pattern && (string = string.replace(pattern, `${obj[key]}`));
        };
        return string;
    };
    Templating.prototype._toElement = function(template, tag){
        let fr = document.createElement('template');
        fr.innerHTML = template;
        return fr.content.children[0];
    };
    Templating.prototype.createElement = function(){
        let template = this.template;
        let data = this.data;
        let isConvert = this.isConvert;
    
    
        if (data){
            if (data instanceof Array){
                let isString = typeof template == 'string';
                let tag = (isString)?this._getTag(template): template.tagName;
                template = (isString)?template:template.outerHTML;
    
                let els = [];
                for (let d = 0; d < data.length; d++){
                    let dd = data[d];
                    let bindData = this._bindReplace(dd, template);
                    let element = this._toElement(bindData, tag);
                    if (isConvert){
                        element = element.outerHTML;
                    };
                    els.push(element);
                };
                return els;
            } else if (data instanceof Object){
                // console.log(template)
                let isString = typeof template == 'string';
                let tag = (isString)?this._getTag(template): template.tagName;
                template = (isString)?template:template.outerHTML;
    
    
                let bindData = this._bindReplace(data, template);
                let element = this._toElement(bindData, tag);
                if (isConvert){
                    element = element.outerHTML;
                };
                return element;
            }
        } else {
            let isString = typeof template == 'string';
            let tag = (isString)?this._getTag(template): template.tagName;
            return this._toElement(template, tag);
        };
    };
    global.Templating = Templating;
})(window);

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
                let isPrevented = !(event.substring(0,1) == '~');
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


function Cakes(name){
    this.name = name;
    this.components = {};
};


Cakes.Components = function(name){
    return {
        subscribe(cb, ctx){
            function subscribeExternal(){
                let component = Cakes.Components[name];
                
                if (component){
                    if (cb instanceof Function){
                        let name = cb.name;
                        if (ctx){
                            cb = cb.bind(ctx)
                        }
                        cb.binded = 'external';
                        cb.original = name;
                        cb.listenTo = component.name;
                        component.Subscribe(cb);
                    }
                } else {
                };
            };
            return new Promise((res, rej)=>{

                let lk = setInterval(()=>{
                    if (Cakes.Components[name]){
                        
                        subscribeExternal();
                        clearInterval(lk);
                        res();
                    };
                });
            })
        },
    };
};


Cakes.Models = {};
Cakes.Subscribe = {};
Cakes.Handlers = {};
Cakes.Attributes = new Attrib();





Cakes.Models.$loaded = function(name){
    return new Promise((res, rej)=>{
        let mk = setInterval(()=>{
            if (Cakes.Models[name]){
                clearInterval(mk);
                res(Cakes.Models[name]);
            };
        });
        setTimeout(()=>{
            if(!Cakes.Models[name]){
                clearInterval(mk);
                rej(name);
            }
        }, 10000);
    })
};



Cakes.Utils = {
    scopeTrap(k){
        return false;
    },
    scopeNotifier(m){
        return m;
    },
};
Cakes.create = function(name, template, options){
    let group = new Cakes(name, template, options);
    group.create(name, template, options);
};
Cakes.plugin = function(){};
Cakes.init = function(name){
    return new Cakes(name);
};

Cakes.Scope = new Scope(Cakes, {
    trap(k){
        return Cakes.Utils.scopeTrap(k);
    },
});

Cakes.Hasher = new Hasher(Cakes.Components); 
Cakes.Hasher.listen();
//register a notifier;
Cakes.Scope.registerNotifier(function(prop, newValue, prevValue){
    Cakes.Attributes.notifier(prop, newValue, prevValue);
});

Cakes.Attributes.registerNotifier(function(obj){
    Cakes.Scope.notifier(obj);
});

Cakes.Persistent = new Persistent;

Cakes.Persistent.listen(Cakes.Components);

Cakes.Cache = new StorageKit({
    name:'cache',
    storage:'session',
});

Cakes.getSubscriber = function(component, handler){
    let subscribe = Cakes.Subscribe;
    let obj = {};
    for (let c in subscribe){
        let handlers = subscribe[c];
        // console.log(handlers);
        for (let h in handlers){
            let hs = handlers[h];
            
            for (let h of hs){
                let _handler = h;
                let original = _handler.original;
                let binded = _handler.binded;
                let listenTo = _handler.listenTo;

                if (listenTo == component){
                    // console.log(original, handler, original==handler);
                    if (original == handler){
                        if (!obj[binded]){
                            obj[binded] = handler;
                        } else {
                            let v = obj[binded] instanceof Array?obj[binded]:[obj[binded]];
                            obj[binded] = v.concat(handler);
                        };
                    } else if(!handler) {
                        // console.log(h);
                        if (!obj[binded]){
                            obj[binded] = original;
                        } else {
                            let v = obj[binded] instanceof Array?obj[binded]:[obj[binded]];
                            obj[binded] = v.concat(original);
                        };
                    }
                };

            }
        };
    };
    return obj;
};

Cakes.Cache.getAll()
    .then(items=>{
        //in every refresh of the app the items in the Keep will be queried and re-watch by the Scope
        if (items instanceof Array){
            for (let i = 0; i < items.length; i++){
                let item = items[i];
                Cakes.Scope.watch(item);
            }
        } else if (typeof items == 'string'){
            Cakes.Scope.watch(items);
        };
    });
 
Cakes.Observer = new Observer(Cakes.Subscribe, Cakes.Handlers);

Cakes.prototype._defineProperty = function(component, prop, get, set){
    Object.defineProperty(component, prop, {
        configurable:true,
        get(){
            return get();
        },
        set(value){
            if (set){
                set(value);
            } else {
                // throw new Error(`unable to set property in (${prop})`);
            }
        },
    });
};

Cakes.worker = (function(){
    // let sw = new Worker('/scripts/cake-worker.js');
    // return function(route, data){
    //     let obj  = {route, data};
    //     sw.postMessage(obj);
    //     return new Promise((res, rej)=>{
    //         sw.onmessage = function(e){
    //             res(e.data);
    //         }
    //     });
    // }
})();


Cakes.prototype._defineProperty(Cake.prototype, '$worker', function(){
    let sw = new Worker('worker.js');
    return function(route, data){
        sw.postMessage({route, data});
        return new Promise((res, rej)=>{
            sw.onmessage = function(e){
                res(e.data);
            }
        });
    }
})

Cakes.prototype._defineProperty(Cake.prototype, '$observer', function(){
    return Cakes.Observer;
});
//scope
Cakes.prototype._defineProperty(Cake.prototype, '$scope', function(){
    Cakes.Scope.install();
    let scope = Cakes.$scope;
    Object.defineProperty(scope, 'extend', {
        configurable:true,
        get(){
            return function(target, obj){
                target = Cakes.Scope.temp[target];
                if ((target).toString().includes('Object')){
                    Object.assign(target, obj);
                } else {
                    console.error(`${target} is not an intance of Object`);
                };
            };
        }
    });
    return scope;
});
//attributes
Cakes.prototype._defineProperty(Cake.prototype, '$attrib', function(){
    return Cakes.Attributes;
});
//persistent ui using sessionStorage
Cakes.prototype._defineProperty(Cake.prototype, '$persist', function(){
    return Cakes.Persistent;
});
//caching data;
Cakes.prototype._defineProperty(Cake.prototype, '$cache', function(){
    return Cakes.Cache;
});
//hash
Cakes.prototype._defineProperty(Cake.prototype, '$hash', function(){
    return Cakes.Hasher;
});



Cakes.prototype.create = function(name, template, options){
    // console.time(name);
    //observer

    console.time(name);
    let component = new Cake(name, template, options);
    //after it has been pass to Cakem t ws assumed that the fn are binded to component holder;
  
    component.compile.then(()=>{
        let { subscribe, root, html, handlers, role} = component;
        // console.log(root);
        // console.log(role == 'form');
        role == 'form' && (function(){
            Formy.bind(component)();
            // console.log(component)
        })();

        //subscribe and handlers are binded to its componnt
        Cakes.Observer.registerSubscribe(subscribe);
        Cakes.Observer.registerHandlers(handlers, component.name);
        this._defineProperty(component, 'root', function(){
            if (component._root){
                return component._root;
            }else {
                let selector = root || '#app';
                let query = document.querySelector(selector);
                if (query){
                    return query;
                }
            };
            throw new Error(`the selector '${selector}' as container of component '${component.name}' is not found!`);
        },function(value){
            Object.assign(component, {_root:value})
        });
        //html getter;
    }).then(()=>{
        component.fire = (function(){
            function fire(name, variable){
                /**
                 * the static fn of fire are those declared in handlers;
                 * fire is also a function that accepts handler fn, that is not declared in handlers;
                 * these are commonly refers to quick functions;
                 * the usage of fire is to manually run the notify, it tells notify what handler has been fired;
                 * so that the notify will make a variable from it, to be feed to subscriber to that;
                 */

                variable = !variable?null:typeof variable == 'function'?variable.bind(component)():(function(){return variable}).bind(component)();

                let o = {
                    [name]:()=>{
                        return variable;
                    }
                };
                fn = o[name].bind(component);
                if (typeof fn == 'function'){
                    fn.name = name;
                    fn.original = name;
                    fn.binded = component.name;
                    Cakes.Observer.registerHandlers({[name]: fn}, component.name);
                    // const awaitNotify = Cakes.Observer.notify(component.name, name, {});
                    // component.await[name] = awaitNotify;
                    // return awaitNotify;
                    const notify = Cakes.Observer.notify(component.name, name, {}).then(()=>{
                        return Cakes.Observer.results[component.name][name];
                    });
                    component.await[name] = notify;
                    return component.await[name];
                };
                console.error(`the param in fire is not an instance of function`);
            };
            
            function addStaticMethod(fn, handlers){
                for (let h in handlers){
                    let handler = handlers[h];
                    let event = handler.original;
                    Object.defineProperty(fn, event, {
                        get(){
                            let fn = {
                                [event]:function (variable, isBroadcast){
                                    
                                    //automatic broadcast if the event is destroy;
                                    if (isBroadcast != undefined){
                                        isBroadcast = isBroadcast;
                                    };
                                    if (isBroadcast == undefined && event == 'destroy'){
                                        //force to broadcast is destroy event;
                                        isBroadcast = true;
                                    };
                                    if (isBroadcast == undefined){
                                        isBroadcast = false;
                                    }

                                    if (isBroadcast){
                                        /**
                                         * async
                                         */
                                        // console.log(component.name)
                                        // if (event == 'destroy'){
                                        //     console.log('start of destroying')
                                        // }
                                        const notify = new Promise((res, rej)=>{
                                            //without setTimeout, there will be a problem;
                                            //i think setTimeout, helps the promise to call resolve;
                                            //as it commands the promise to resolve on the next clock tick;
                                            setTimeout(()=>{
                                                // let not = Cakes.Observer.notify(component.name, event, variable);
                                                Cakes.Observer.notify(component.name, event, variable).then(()=>{

                                                    return Cakes.Observer.results[component.name][event];
                                                }).then(r=>{
                                                    res(r);
                                                }).catch(err=>{
                                                    console.error(err);
                                                });
                                                
                                            });
                                        });
                                        component.await[event] = notify;
                                        return component.await[event];
                                        // console.log(variable, !!isBroadcast, handler);
                                    } else {
                                        return handler(variable);
                                    };
                                }
                            };
                            fn[event] = fn[event].bind(component);
                            fn[event].originalName = event;
                            fn[event].binded = component.name;

                            return fn[event];
                        },
                    });
                };
            }
            addStaticMethod(fire, component.handlers);

            return fire;
        })()
    }).then(()=>{

        if (component.type == 'view'){
            // component.observer.register(subscribe);
            // component.observer(Cakes.Subscribe);

            //parse attributes;


            // //get watch items
            // //register watch items;
            // //register to scope
            // component._watchBindedItems()//these are the binded data declared in html;

            component.toggler = component.toggler(component);
            //store the component, for cacheing;
            Cakes.Components[name] = component;
        };
    }).then(()=>{

        if (component.type == 'model'){
            Cakes.Models[name] = component;
        }
        if (component.isStatic && component.type == 'view'){
            // console.log(component.fire)
            // console.time();
            component.render();
            // console.timeEnd();
        } else {
            
        };
    }).finally(()=>{
        // console.timeEnd(name);

        // if (component.type == 'model'){
        //     component.fire(function isConnected(){});
        // }
    });
    // console.timeEnd(name);
};






