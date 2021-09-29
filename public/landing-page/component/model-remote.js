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
                // location.replace(`${location.origin}/user`); 
                location.replace(location.origin);
            });
        },
        sendotp(data){
            this.fire('spinnerRender');
            this.utils.post('/sendotp', {body:data}).then(r=>{
                // location.replace(`${location.origin}/user`);
                return r.json();
            }).then(r=>{
                if (r.status){
                    this.fire('renderOtpVerify', {payload:data, response:r});
                } else {
                    this.fire('spinnerDestroy');
                    this.fire('alertError', r.message);
                }
            });
        },
        verifyotp(data){
            this.fire('spinnerRender');
            this.utils.post('/verifyotp', {body:data}).then(r=>{
                // location.replace(`${location.origin}/user`);
                return r.json();
            }).then(r=>{
                if (r.status){
                    location.replace(location.origin);
                } else {
                    this.fire('spinnerDestroy');
                    this.fire('alertError', r.message);
                }
            });
        }
    },
    subscribe:{
        'login-form':{
            submit(e){ 
                this.fire.login(e);
            },
            sendotp(obj){
                this.fire.sendotp(obj);
            }
        },
        'login-form-otp':{
            submit(e){
                this.fire.verifyotp(e);
            }
        }
    },
})