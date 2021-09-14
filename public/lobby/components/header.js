Cakes.create('header', '#header', {
    toggle:{
        burger:{
            sel:'[name=burger]', cls:'is-active',
        },
        navbar:{
            sel:'[name=navbar]', cls:'is-active',
        }
    },
    handlers:{
        burger(e){
            this.toggler('burger');
            this.toggler('navbar');
        }
    },
    subscribe:{},
});