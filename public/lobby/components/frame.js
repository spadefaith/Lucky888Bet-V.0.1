Cakes.create('frame', '#frame', {
    data(self){
        this.fortune30 = 'https://3.133.4.140/games/e-bingo/fortune30';
    },
    handlers:{
        beforeConnected(e){
            this.$cache.get('game').then(r=>{
                let [{game}] = r;
                // console.log(e.element.getElement())
                // console.log(game, e, this.data.fortune30);

                // this.$scope.game_path = this.data.fortune30
            });
        }, 
        isConnected(e){

        }
    },
    subscribe:{
        modal:{
            openFrame(e){
                this.render({root:e});
            }
        }
    },
});