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
        },
        logout(e){
            this.utils.post('/logout',).then(r=>{
                location.replace('/');
            });
        },
        getPlayer(){
            this.utils.get('/player').then(r=>{
                return r.json();
            }).then(r=>{
                let enc = r;
                let a = document.createElement('a');
                a.href = `http://localhost:7778/`;
                a.target = '_blank';
                a.click();
            });
        }
    },
    subscribe:{
        'login-form':{
            submit(e){ 
                this.fire.login(e);
            }
        },
        'header':{
            logout(e){
                this.fire.logout();
            }
        },
        category:{
            getPlayer(){
                this.fire.getPlayer();
            }
        }
    },
})