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
})(window)