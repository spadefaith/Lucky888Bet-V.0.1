Cakes.create('main-section', '#main-section',{
    data(){
        this.started = false;
        this.index = 0;
        this.timer = null;
        this.interval = 2000;
        this.cf = null;
    },
    handlers:{
        isConnected(){
            this.fire.renderSlides(null, true);
        },
        renderSlides(){
            return this.fire(function getGames(){})
            
        },
    },
    subscribe:{},
});