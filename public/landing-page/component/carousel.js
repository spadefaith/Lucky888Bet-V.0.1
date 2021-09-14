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
                // width:'1146px',
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
})