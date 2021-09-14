const { Schema } = require("mongoose");
const config = require('../config/config');
const _fields = require('./fields.js');
const utils = require('./utils');

function _listTbl(tbl){
    let t = [tbl];
    let cf = config[tbl];
    if (cf.temp){
        t.push(`temp_${tbl}`);
    };
    return t;
};

function _createSchema(tbl){
    let {display, rel, join, fields:cols} = config[tbl];
    let fields = utils.getItems(_fields, cols);
    // console.log(fields)
    
    let schemaField = fields.reduce((accu, iter)=>{
        type = utils.mapTypeForMongoose(iter.type || 'text');
        accu[iter.field] = type;
        return accu;
    }, {});
    

    let rels = {};
    if (rel){
        for (let f in rel){
            rels[f] = [{
                type:Schema.Types.ObjectId,
                ref:rel[f].ref,
            }];
        };
    };

    let joins = {};
    if (join){
        let fs = [];
        for(let field in join){
            let {ref, map, fields} = join[field];
            fs = fs.concat(fields);
        };
        let fields = utils.getItems(_fields, fs);
        for (let f = 0; f < fields.length; f++){
            let type = utils.mapTypeForMongoose(fields[f].type || 'text');
            if (fs[f]){
                //to remove the automatic append field;
                joins[fs[f]] = type;
            }
        }
    };
    return Object.assign(schemaField, rels, joins);
};

function _compileSchemas(){
    let compiled = {};
    for (let tbl in config){
        let tbls = _listTbl(tbl);
        let schema = _createSchema(tbl);
        for (let t = 0; t < tbls.length; t++){
            let tbl = tbls[t];
            compiled[tbl] = schema;
        };
    };
    return compiled;
};


module.exports = _compileSchemas();