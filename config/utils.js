/**
 * get item in objects from array criteria;
 * @param {Object} src 
 * @param {Array} cols 
 * @param private {string} field
 */
exports.getItems = function(src, cols){

    return !cols.length?[]:cols.reduce((accu, col)=>{
        if (col){
            let proxy = col.includes(':');
            let item;
            if (proxy){
                proxy = col;
                let [id_src, display_src] = proxy.split(':');
                let idSrc = src[id_src];
                item = src[display_src];
                if (!item){
                    throw new Error(`the ${col} is not defined in the fields`);
                }
                item.field = id_src; 
            } else {
                item = src[col];
                if (!item){
                    throw new Error(`the ${col} is not defined in the fields`);
                }
                item.field = col;
            };
            accu.push(item);
        }
        return accu;
    }, []);

};

/**
 * get the equivalent type for mongoose schema;
 * @param {String} type - text | number | date
 */
exports.mapTypeForMongoose = function(type){
    switch(true){
        case type == 'text':return {type:String, trim:true};
        case type == 'number':return Number;
        case type == 'date':return Date;
    };
};

