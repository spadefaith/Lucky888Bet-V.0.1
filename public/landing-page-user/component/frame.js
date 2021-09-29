Cakes.create('frame', '#frame', {
    data(self){
        this.deposit = 'https://3.133.4.140/games/e-bingo/fortune30';
        this.signup = 'https://3.133.4.140/games/e-bingo/fortune30';
        this.login = 'https://3.133.4.140/games/e-bingo/fortune30';
    },
    handlers:{
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