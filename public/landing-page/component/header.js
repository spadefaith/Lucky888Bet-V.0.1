Cakes.create('header', '#header', {
    toggle:{
        burger:{
            sel:'[name=burger]', cls:'is-active',
        },
        lang:{
            sel:'.language-dropdown', cls:'is-active',
        },
        arr:{
            sel:'.language-support a>img', cls:'is-active',
        }
    },
    handlers:{
        burger(e){
            this.toggler('burger');
        },
        click(e){
            let role = e.target.dataset.role;
            if (role == 'signup'){
                let fn;
                this.fire(function validateAge(){});
            } ;
        },
        login(e){
            this.fire('renderLogin', 'login')
        },
        chooseLang(e){
            this.toggler('lang');
            this.toggler('arr');
        }
    },
    subscribe:{},
});