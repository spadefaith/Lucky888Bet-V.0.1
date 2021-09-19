Cakes.create('category', '#category', {
    handlers:{
        bingoLobby(e){
           this.fire('getPlayer');  
        },
    },
    subscribe:{ 

    },
})