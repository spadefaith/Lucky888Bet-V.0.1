Cakes.create('brochure', '#brochure', {
    root:".second-level",
    handlers:{},
    subscribe:{
        'main-section':{
            isConnected(){
                // this.renderAsync();
            }
        }
    },
})