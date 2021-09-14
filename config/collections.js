const mongoose = require('mongoose');
const schemas = require('./schemas.js');

// console.log(schemas);


const loc = 'mongodb://localhost:27017';
const DB_NAME = 'games';
const url =  `${loc}/${DB_NAME}`;
const Schema = mongoose.Schema;

mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(r=>{
    // console.log(r.models, 17);
})
mongoose.Promise = global.Promise;


mongoose.connection.on("error", error => {
    console.log('Problem connection to the database'+error);
});


let collections = {};

for (let tbl in schemas){
    collections[tbl] = mongoose.model(tbl, new Schema(schemas[tbl]));
}


module.exports = collections;
