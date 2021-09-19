Cakes.create('category', '#category',{
    handlers:{
        login(e){
            this.fire('renderLogin');
        }
    },
    subscribe:{},
})