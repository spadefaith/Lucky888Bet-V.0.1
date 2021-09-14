Cakes.create('nav', '#nav', {
    toggle:{
        nav:{
            sel:'.bottom>#nav .navbar-item', cls:'is-active', basis:'name',mode:'switch',
        },
        navbar:{
            ns:'navbar',cls:'is-active',
        },

    },
    handlers:{
        burger(e){
            e.target.classList.toggle('is-active');
            this.toggler('navbar');
        },
        kycClick(e){
            let target = e.target;
            let name = target.getAttribute('name');
            let fnName = `render${name}`;
            this.fire(this.utils.createFn(fnName, name));
        },
        navClick(e){
            let target = e.target;
            let name = target.closest('[name]');
            if (!name){return false;};
            name = name.getAttribute('name');
            this.fire.drop(name, true);
            name && this.toggler('nav',name);
        },
        drop(name){
            let destroy = this.fire(function destroyDrop(){});
            let prev = this.data.drop;
            if (prev != name){
                destroy.then(()=>{
                    this.fire(function getGames(){return name}).then(drops=>{
                        !!drops && this.fire(function renderDrop(){
                            return drops;
                        });
                    });
                });
                this.data.drop = name;
            } else {
                this.data.drop = null;
            };
        },
    },
    subscribe:{
        
    }
})