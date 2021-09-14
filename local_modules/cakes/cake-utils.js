

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

