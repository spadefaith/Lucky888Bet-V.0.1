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

