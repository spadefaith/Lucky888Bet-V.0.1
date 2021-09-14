Cakes.create('app', '#app', {
    data(){

        this.games = {
            classic:[
                {img:'./image/game-small/bingo_games/bingo_peryahan_2.png', display:'Fortune'},
                {img:'./image/game-small/bingo_games/fortune_30_2.png', display:'Golden Era'},
                {img:'./image/game-small/bingo_games/golden_era_2.png', display:'Golden Farm'},
                {img:'./image/game-small/bingo_games/gold_farm_2.png', display:'Peryahan'},
                {img:'./image/game-small/bingo_games/pirate_babes_2.png', display:'Pirate Babes'},
                {img:'./image/game-small/bingo_games/sea_riches_2.png', display:'Sea Riches'},
            ],
            variant:[
                {img:'./image/game-small/bingo_variants/3_ball_poker_bingo_2.png' ,display:'3 ball poker bingo'},
                {img:'./image/game-small/bingo_variants/13_ball_bingo_2.png' ,display:'13 Ball Bingo'},
                {img:'./image/game-small/bingo_variants/bingo_pares_2.png' ,display:'Bingo'},
                {img:'./image/game-small/bingo_variants/bingo_swertres_2.png' ,display:'Bingo Fortune 21'},
                {img:'./image/game-small/bingo_variants/dragon_vs_tiger_2.png' ,display:'Bingo Pares'},
                {img:'./image/game-small/bingo_variants/fortune_21_2.png' ,display:'Dragon Vs. Tiger'},
                {img:'./image/game-small/bingo_variants/lucky_9_2.png' ,display:'Lucky 9'},
            ],
        };
        this.player = {
            display:'Player',
            components:[],
            fields:[
                {field: 'name', title: 'Player Name', tag: 'input', ui:'table', readonly:true},
                {field: 'first_name', title: 'First Name', tag: 'input', ui:'form', },
                {field: 'middle_name', title: 'Middle Name', tag: 'input', ui:'form', },
                {field: 'last_name', title: 'Last Name', tag: 'input', ui:'form', },
                {field: 'age', title: 'Age', tag: 'input', ui:'form', },
                {field: 'gender', title: 'Gender', tag: 'input', ui:'form', },
                {field: 'address', title: 'Address', tag: 'input', ui:'form', },
                {field: 'favorite', title: 'Favorite Games', tag: 'input', ui:'form', },
            ]
        }
    },
    handlers:{
        isConnected(){
            console.log('app is connected');
            // setTimeout(()=>{
            //     this.fire.renderSlides(null, true);
            // }, 100)
            this.$cache.get('isValidAge').then(r=>{
                if (!r){
                    setTimeout(()=>{
                        this.fire(function renderPop(){});
                    },1000);
                };
            });
        },
        isValidateAge(){
            console.log('yess')
            this.$cache.createOrUpdate('isValidAge', true);
        },
        renderSlides(){
            // return this.data.games
        }
    },
    subscribe:{
        getGames:{
            components:['main-section', 'dropdown', 'nav'],
            handler(name){
                console.log(name)
                return name?this.data.games[name]:this.data.games;
            }
        },
        validateAge:{
            components:['pop', 'header'],
            handler(e){
                this.fire.isValidateAge();
            },
        },
        // pop:{
        //     validateAge(e){
        //     },
        // },
    },
});