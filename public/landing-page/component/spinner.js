Cakes.create('spinner', '#spinner', {
    root:'body',
    handlers:{
        destroy(){
            this.reset();
        }
    },
    subscribe:{
        spinnerRender:{
            components:['model-remote', 'login-form', 'login-form-otp'],
            handler(e){
                console.log('spinner is connected');
                this.render();
            },
        },
        spinnerDestroy:{
            components:['model-remote', 'login-form', 'login-form-otp'],
            handler(e){
                this.fire.destroy();
            },
        }
    },
});