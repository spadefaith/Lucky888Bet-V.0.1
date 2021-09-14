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
