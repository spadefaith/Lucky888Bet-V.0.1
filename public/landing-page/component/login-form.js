Cakes.create('login-form', '#login', {
    root:'.modal-content',
    handlers:{
        destroy(){
            this.reset();
        },
        login(e){
            let data = new FormData(e.target);
            let o = {};
            for (let [key, value] of data.entries()){
                o[key] = value;
            };
            console.log(o);
        },
        submit(e){
            let data = new FormData(e.target);
            let o = {}; 
            for (let [key, value] of data.entries()){ 
                o[key] = value;
            }; 
            console.log(o)
            return o;
        },
        sendotp(e){
            let data = new FormData(e.target);
            let o = {}; 
            for (let [key, value] of data.entries()){ 
                o[key] = value;
            };
            return o;
        }
    },
    subscribe:{
        modal:{
            renderlogin(e){
                this.render();
            }
        },
        'model-remote':{
            renderOtpVerify(e){
                this.fire.destroy();
                this.await.destroy.then(()=>{
                    this.fire('renderOtpVerify', e);
                });
            }
        }
    },
});