Cakes.create('header', '#header', {
    toggle:{
        burger:{
            sel:'[name=burger]', cls:'is-active',
        }
    },
    handlers:{
        burger(e){
            this.toggler('burger');
        },
        click(e){
            let role = e.target.dataset.role;
            if (role){
                let fn;
                // if (role == 'sign-up'){
                //     fn = this.utils.createFn(`render-modal`, {trigger:'sign-up'});
                // }
                // if (role == 'login'){
                //     fn = this.utils.createFn(`render-modal`, {trigger:'sign-up'});
                // }
                // this.fire(fn);
                this.fire(function validateAge(){});
            };
        }
    },
    subscribe:{},
});