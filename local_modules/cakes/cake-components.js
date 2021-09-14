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
            function fire(fn){
                /**
                 * the static fn of fire are those declared in handlers;
                 * fire is also a function that accepts handler fn, that is not declared in handlers;
                 * these are commonly refers to quick functions;
                 * the usage of fire is to manually run the notify, it tells notify what handler has been fired;
                 * so that the notify will make a variable from it, to be feed to subscriber to that;
                 */
                if (typeof fn == 'function'){
                    let name = fn.name;
                    fn = fn.bind(component);
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






