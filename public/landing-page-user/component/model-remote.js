Cakes.create('model-remote', null, {
    type:'model',
    utils(self){
        const _fetch = (method)=>{
            
            return (path, obj)=>{
                let config = {
                    method,
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit, 
                };
                if (obj && obj.body){
                    config.body = JSON.stringify(obj.body);
                    config.headers = {'Content-Type': 'application/json',};
                };
                return fetch(path,config);
            };
        };
        this.post = _fetch('POST');
        this.get = _fetch('GET');
    },
    handlers:{
        login(data){
            this.utils.post('/login', {body:data}).then(r=>{
                console.log(r);
            });
        }
    },
    subscribe:{
        'login-form':{
            submit(e){ 
                this.fire.login(e);
            }
        }
    },
})