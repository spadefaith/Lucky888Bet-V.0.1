;(function(){
    ;Cakes.create('app', '#app', {
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
                    console.log(r, !r);
                    if (!r){
                        setTimeout(()=>{
                            this.fire('renderPop');
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
    
    Cakes.create('carousel', '#carousel', {
        root:'.carousel-container',
        handlers:{
            isConnected(){
    
                const splide = this.data.splide = new Splide('.carousel', {
                    type:'fade',
                    rewind:true,
                    autoplay:true,
                    interval:5000,
                    focus:'center',
                    width:'1900px',
                    // height:'320px',
                }).mount();
    
            
                // splide.on('active', this.fire.slideActive);
                // splide.on('hidden', this.fire.slideHide);
            },
            slideActive(e){
                // let slide = e.slide;
    
                // let cells = slide.querySelectorAll('.cell');
    
                // anime({
                //     targets: cells,
                //     scale: [
                //       {value: .1, easing: 'easeOutSine', duration: 500},
                //       {value: 1, easing: 'easeInOutQuad', duration: 1200}
                //     ],
                //     delay: anime.stagger(200, {grid: [10, 9], from: 'center'}),
                //     complete: (anim) =>{
                //         let timer = setTimeout(()=>{
                //             this.data.splide.go('+1');
                //             clearTimeout(timer);
                //         },500)
                //     }
                // })
            },
            slideHide(e){
                let slide = e.slide;
            }
        },
        subscribe:{
            app:{
                isConnected(){
                    this.renderAsync();
                }
            }
        },
    });
    Cakes.create('form.login', '#form.login', {
        root:'[name=form-container]',
        handlers:{
            destroy(){},
            submit(e){},
            isConnected(e){},
        },
        subscribe:{},
    });
    Cakes.create('form.sign-up', '#form.sign-up', {
        root:'[name=form-container]',
        data(self){
    
            this.fields = {
                1:{
                    display:'Mobile Number',
                    fields:[
                        'mobile_number',
                    ]
                },
                2:{
                    display:'OTP Verification',
                    fields:[
                        'otp',
                    ]
                },
                3:{
                    display:'Identity Details',
                    fields:[
                        'branch',
                        'citation',
                        'first_name',
                        'middle_name',
                        'last_name',
                        'gender',
                        'birth_date',
                        'birth_place',
                        'nationality',
                        'civil_status',
                        'occupation',
                        'agree',
                    ]
                },
                4:{
                    display:'Address Details',
                    fields:[
                        'address.province',
                        'address.building',
                        'address.city',
                        'address.street',
                        'address.barangay',
                        'address.house/unit/floor',
                        'address.full_address',
                    ]
                },
                5:{
                    display:'Account Details',
                    fields:[
                        'contact.email_address',
                        'contact.email_address_confirmed',
                        'file.id'
                    ],
                },
            }
    
            this.step = 1;
        },
        utils(self){
            this.getField = ()=>{
                let {display, fields} = self.data.fields[self.data.step];
                self.data.formDisplay = display;
                return fields.map(item=>{
                    item.id = item;
                    return FIELDS[item];
                });
            }
        },
        handlers:{
            destroy(){},
            next(e){
                console.log(e);
            },
            cancel(e){
                console.log(e);
            },
            submit(e){
                console.log(e);
            },
            isConnected(e){
                let fields = this.utils.getField();
    
            },
        },
        subscribe:{
            'render-sign-up':{
                components:['modal'],
                handler(e){
                    this.render({hashed:true});
                },
            }
        },
    });
    

    Cakes.create('model-remote', null, {
        type:'model',
        handlers:{},
        subscribe:{
            app:{
                
            }
        },
    });
    ;Cakes.create('pop', '#pop', {
        root:'.modal-content',
        handlers:{
            destroy(e){
                this.reset();
            },
            _destroy(e){},
            click(e){
                let target = e.target;
                console.log(target.dataset.name == 'yes');
                if (target.dataset.name == 'yes'){
                    this.fire('validateAge');
                    this.fire('destroyModal');
                } else if (target.dataset.name == 'no'){
                    console.log('no valid age');
                };
            },
        },
        subscribe:{
            modal:{
                destroy(e){
                    this.fire.destroy();
                },
                renderpop(e){
                    console.log('pop is rendered')
                    this.render();
                }
            }
        },
    });
})();