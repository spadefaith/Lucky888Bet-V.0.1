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