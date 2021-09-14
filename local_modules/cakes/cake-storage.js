// function StorageKit(obj){
//     this.name = obj.name;
//     this.id = obj.id || '_id';
//     this.parent = obj.parent || {};
//     this.child = obj.child;
// };

;(function(global, factory){
    global.StorageKit = factory();
})(this, function(){
    //in-memory
    window._storage_kit = {};


    class $storageArray{
        constructor(_id){
            this.id = _id;
        }
        has(db, data){
            if (this.id){
                //obj;
                var index = db.findIndex(item=>{
                    return item[this.id] == data[this.id];
                });
            } else {
                //string
                var index = db.findIndex(item=>{
                    return item == data;
                });
            };
            return (index == -1)?false:index+1;
        }
        create(db, _data){
            let has = this.has(db, _data);
            if (has){
                return false;
            } else {
                db.push(_data);
                return true;
            };
        }
        createOrUpdate(db, data){

            let has = this.has(db, data);
            if (has){
                db[has-1] = data;
            } else {
                db.push(data);
            };
            return !!has;
        }
        get(db, q){
            let query = [];
            let hasID = !!this.id;

            for (let d = 0; d < db.length; d++){
                let item = db[d];
                if (q instanceof Array){
                    for(let a = 0; a < q.length; a++){
                        let e = q[a];
                        if (hasID){
                            if (e == item[this.id]){
                                query.push(item);
                            }
                        } else {
                            if (e == item){
                                query.push(item);
                            };
                        }
                    };
                };
            };
             
            if (query.length){
                return query; 
            };
             
            return !!query.length;
        }
        update(db, data){
            let has = this.has(db, data);
            if (has){
                db[has-1] = data;
                return db;
            } else {
                return !!has;
            };
        }
        remove(db, r){
            let filtered = [];
            let hasID = !!this.id;
            for (let d = 0; d < db.length; d++){
                let item = db[d];
                if (r instanceof Array){
                    for (let a = 0; a < r.length; a++){
                        let e = r[a];
                        if (hasID){
                            if (e != item[this.id]){
                                filtered.push(item);
                            }
                        } else {
                            if (e != item){
                                filtered.push(item);
                            };
                        };
                    };
                };
            };
             
            return filtered;
        }
    }
    class $storageObject{
        constructor(_id){
            this.id = _id;
        }

    }

    function instanceOf(item, con){
        return item instanceof con;
    }

    class $storageConnection{
        constructor(obj){
            this.name = obj.name;
            this.storage = obj.storage;
            this.storageType = 'storage';
            this.child = obj.child || [];
            this.id = (obj.id == false)?null:obj.id || '_id';
            
            
                let storage = this. storage;
                if (storage == 'memory'){
                    this.storage = window._storage_kit;
                    this.storageType = 'object';
                } else if (storage == 'session'){
                    this.storage = sessionStorage;
                } else if (storage == 'local'){
                    this.storage = localStorage;
                };
                let child = this.child;
  
                if (child instanceof Array){
                    this.childType = 'array';
                } else if (child instanceof Object){
                    this.childType = 'object';
                };
            this.open();
        }
        open(){
            if (this.storageType == 'storage'){
                if (!this.storage[this.name]){
                    this.storage.setItem(this.name, JSON.stringify(this.child));
                };
                return JSON.parse(this.storage.getItem(this.name));
            } else if (this.storageType == 'object'){
                if (!this.storage[this.name]){
                    this.storage[this.name] = this.child;
                };
                return this.storage[this.name];
            };
        }
        close(db){
            if (this.storageType == 'storage'){
                this.storage.setItem(this.name, JSON.stringify(db));
            } else if (this.storageType == 'object'){
                this.storage[this.name] = db;
            };
        }
    };

    class $storage extends $storageConnection{
        constructor(obj){
            super(obj);
            if (this.childType == 'array'){
                this.method = new $storageArray(this.id);
            } else if (this.childType == 'object'){
                this.method = new $storageObject(this.id);
            };
        }
        create(_item){
            let args = arguments, obj = {};
            if (args.length == 1){
                let arg = args[0];
                if (this.id){
                    //it must be an object;
                    if (typeof arg == 'object' && (arg).toString().includes('Object')){
                        if (!arg[this.id]){
                            throw new Error(`no id given or the format must be ${this.id}`);
                        };
                        obj = arg;
                    } else {
                        throw new Error(`this data ${JSON.stringify(arg)} must be an object`);
                    };
                } else {
                    if (typeof arg == 'string'){
                        obj = _item;
                    };
                };
            } else if (args.length == 2){
                let [key, value] = args;
                obj = {[this.id]:key, [key]:value};
            };
            let db = this.open();
            this.method.create(db, obj);
            this.close(db);
        }
        createOrUpdate(item){
            let args = arguments, obj = {};
            // console.log(args)
            if (args.length == 1){
                let arg = args[0];
                if (this.id){
                    //it must be an object;
                    if (typeof arg == 'object' && (arg).toString().includes('Object')){
                        if (!arg[this.id]){
                            throw new Error(`no id given or the format must be ${this.id}`);
                        };
                        obj = arg;
                    } else {
                        throw new Error(`this data ${JSON.stringify(arg)} must be an object`);
                    };
                } else {
                    if (typeof arg == 'string'){
                        obj = _item;
                    };
                };
            } else if (args.length == 2){
                let [key, value] = args;
                obj = {[this.id]:key, [key]:value};
            };
            let db = this.open();
            this.method.createOrUpdate(db, obj);
            this.close(db);
        }
        get(){
            let args = arguments;
            var q = [];
            for (let i = 0; i < args.length; i++){
                q.push(args[i]);
            };


            return new Promise((res, rej)=>{
                let db = this.open();
                let query = this.method.get(db, q);
                res && res(query);
            });
        }
        getAll(){
            return new Promise((res)=>{
                let db = this.open();
                res && res(db);
            });
        }
        update(data){
            let db = this.open();
            this.method.update(db, data);
            this.close(db);
        }
        remove(){
            let args = arguments;
            var r = [];
            for (let i = 0; i < args.length; i++){
                r.push(args[i]);
            };

            let db = this.open();

            let removed = this.method.remove(db, r);
            this.close(removed);
        };
    }

    return $storage;

});

