Cakes.create('frame', '#frame', {
    root:'.modal-content',
    data(self){
        this.deposit = cfg.deposit;
        this.signup = cfg.signup;
        this.login = cfg.login;
    },
    handlers:{
        beforeConnected(e){
            let {element:{el:[iframe]}, emit:{trigger}} = e;
            document.querySelector('.modal-content').classList.add('frame');
            if (trigger == 'login-frame'){
                iframe.setAttribute('src', this.data.login);
            }
        },
        isConnected(e){
            console.log('frame is connected');
        }
    },
    subscribe:{
        modal:{
            'render-login-frame':function(e){
                this.render({emit:{trigger:e}});
            }
        }
    },
});