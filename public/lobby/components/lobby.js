Cakes.create('lobby', '#lobby',{
    handlers:{
        click(e){
            this.fire('openModal');
        }
    },
    subscribe:{},
})