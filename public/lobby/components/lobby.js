Cakes.create('lobby', '#lobby',{
    handlers:{
        click(e){
            let role = e.target.dataset.role;
            let name = e.target.dataset.name;
            if (role){
                this.$cache.createOrUpdate('game', name);
                this.fire('openModal');
            }
        },
        isConnected(){ 
            let path = location.pathname;
            let split = path.split('/');
            let enc = split[3];
            let dec = atob(enc); 
            
        }
    },
    subscribe:{},
})