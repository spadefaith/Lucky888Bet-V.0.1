Cakes.create('carousel', '#carousel', {
    root:'.first-level',
    trigger(){

    },
    handlers:{
        isConnected(){
            // console.log('carousel is connected')


            // const results = Splitting({
            //     image: true,
            //   });

            const splide = this.data.splide = new Splide('.carousel', {
                type:'fade',
                rewind:true,
                // autoplay:true,
                interval:5000,
                // width:'1400px';
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
            // console.log();
        }
    },
    subscribe:{
        'main-section':{
            isConnected(){
                // console.log('coe')
                this.renderAsync();
            }
        }
    },
})