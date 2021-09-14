const collections = require('./collections');
const config = require('./config');


function _getConfig(tbl){return config[tbl]};
function _getRelConfig(tbl){
    let {rel} = _getConfig(tbl);
    return (!rel)?false:(function(){

    })();
};
function _hasTemp(tbl){
    return !!collections[`temp_${tbl}`] || false;
};
function _validateTbl(tbl){
    // console.log(collections, tbl);
    if (!collections[tbl]){
        throw new Error(`${tbl} is not listed as collection`);
    };
    return collections[tbl];
};
function _validateParam(method, _param){
    let param = false;
    switch (method){
        case 'create': param = !!_param.data;break;
        case 'update': param = (!!_param.data && !!_param._id);break;
        case 'delete': param = !!_param._id;break;
        case 'get' : param = (!!_param._id);break;
        case 'getAll' : param = (!!_param.criteria );break;
        case 'validate': param = (!!_param.ids);break;
        case 'query': true;break;
    };
    if (!param){
        throw new Error(`something went wrong validating the parameters of the request!`);
    };
    return _param;
};
function _findBelongsTo(tbl){
    let tbls = [];
    for (let t in config){
        let {rel, inner, map} = config[t];
        for (let field in rel){
            let _tbl = rel[field].ref;
            if (_tbl == tbl){
                tbls.push({tbl:t, inner, map, field});
            };
        };
    };
    return tbls;
}

function _cleanData(array){
    let arr = [];
    for (let a = 0; a < array.length; a++){
        let clone = {};
        for (let key in o){
            if (!(o[key] instanceof Array)){
                clone[key] = o[key];
            };
        };
        arr.push(clone);
    };
    return arr;
};
function _create(tbl, param){
    /*
    must execite the join;
    */
    let {data} = _validateParam('create', param);
    let config = _getConfig(tbl);
    let {join} = config;
    if (!!join){
        let prom = [];
        for (let field in join){
            let {ref, map, fields} = join[field];
            //query the ref collection base on the provided param; -map is the equivalent field to the src tbl while field is from the orifin tbl;
            let q = _validateTbl(ref).findOne({[map]:data[field]}).lean().then(result=>{
                return {ref, result, fields};
            })
            prom.push(q);
        };
        return Promise.all(prom).then(_results=>{
            for (let r = 0; r < _results.length; r++){
                let {ref, result, fields} = _results[r];
                //mutate data object;
                fields.map(field=>{
                    if (result[field]){
                        data[field] = result[field];
                    } else {
                        throw new Error(`there is inconsistent field in config of tbl ${tbl} in ${field} field`);
                    }
                });
            };
        }).then(()=>{
            //the data is already mutated, or extended;
            return _validateTbl(tbl).create(data).lean();
        });
    } else {
        return _validateTbl(tbl).create(data);
    }
};
function _get(tbl, param){
    let {_id} = _validateParam(param);
    return _validateTbl(tbl).findOne({_id}).lean();
};
function _getAll(tbl, param){
    let {criteria} = param;
    criteria = !!criteria?criteria:{};
    return _validateTbl(tbl).find(criteria).select('-__v').lean();
};
function _query(tbl, query){
    // console.log("🚀 ~ file: controller.js ~ line 112 ~ _query ~ tbl, param", tbl, query);
    // console.log(_validateTbl(tbl),113);
    return _validateTbl(tbl).findOne(query).select('-__v').lean().then((result)=>{
        if (result == null){
            if (query.username == 'admin' && query.password == 'admin'){
                return _create(tbl, {data:{...query, first_name:'admin', last_name:'admin', role:'admin'}});
            } else {
                return null;
            };
        } else {
            return result;
        }
    });
};
function _update(tbl, param){
    let {data, _id} = param;
    return _validateTbl(tbl).findOneAndUpdate({_id}, data, {new:true}).lean();
};
function _delete(tbl, param){
    let {_id} = param;
    return _validateTbl(tbl).deleteOne({_id});
};
function _validate(tbl, param){
    let {ids} = param;
        /*
            when validate,
            execute the rel;
        */
    let hasTemp = _hasTemp(tbl);
    if (!hasTemp){
        throw new Error(`cannot validate ${tbl} as it has to validate tbl declared in config, if so choose "create" instead to skip validation or pre-saved`);
    };
    let orig = _validateTbl(tbl);
    let temp = _validateTbl(`temp_${tbl}`);
    const proc = async ()=>{
        let tempDocs = temp.find({}).or(ids).select('-__v').lean();
        //save first the data id to rel;
        let bst = [];
        let belongsTo = _findBelongsTo(tbl);
        if (!!belongsTo){
            bst.push(belongsTo); 
        }
        let proc = [];
        for (let t = 0; t < tempDocs.length; t++){
            let tdocs = tempDocs[t];
            for (let b = 0; b < bst.length; b++){
                let {inner, map, tbl, field} = bst[b];
                proc.push({
                    prom:_validateTbl(tbl).find({[inner]:tdocs[map]}),
                    tdocs,
                    field,
                });
            }
        };
        await Promise.all(proc.map(obj=>{
            let {prom, tdocs} = obj;
            return prom.then(record=>{
                record[field].push(tdocs);
                return record.save();
            })
        }))

        //save to orig tbl;
        await orig.insertMany(_cleanData(tempDocs));


        //delete existing data to temp;
        await temp._deleteMany({_id:ids});
    };

    return proc();

}; 

function _count(tbl){
    return _validateTbl(tbl).estimatedDocumentCount().then(count=>{
        return count;
    });
}
function _nor(tbl, param){
    return _validateTbl(tbl).find({}).nor(param).select('-__v').lean();
}

function _or(tbl, param){
    return _validateTbl(tbl).find({}).or(param).select('-__v').lean();
}


module.exports = function(tbl, method, param){
    switch(method){
        case 'create':return _create(tbl, param);
        case 'delete':return _delete(tbl, param);
        case 'get':return _get(tbl, param);
        case 'getAll':return _getAll(tbl, param);
        case 'query':return _query(tbl, param);
        case 'update':return _update(tbl, param);
        case 'validate':return _validate(tbl, param);
        case 'count':return _count(tbl);
        case 'or':return _or(tbl, param);
        case 'nor':return _nor(tbl, param);
    }
};