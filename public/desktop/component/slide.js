Cakes.create('slide', '#slide', {
    root:'.slide-container',
    animate:{
        slide:{
            render:{keyframes:['appear']},
            remove:{keyframes:['disappear']},
        }
    },
    handlers:{
        destroy(){
            this.reset();
        },
        isConnected(obj){
            console.log(obj);
            let {emit:{classic, variant, egames, slot, casino}} = obj;
            Promise.resolve().then(()=>{
                this.$scope.classics = classic;
            }).then(()=>{
                this.$scope.variants = variant;
            }).then(()=>{
                this.$scope.egames = egames;
            }).then(()=>{
                this.$scope.casinos = casino;
            }).then(()=>{
                this.$scope.slots = slot;
            }).then(()=>{
                this.fire.activeSplide();
            })

        },
        activeSplide(){


            document.querySelector('[data-container=classic] .cake-template').remove();
            document.querySelector('[data-container=variant] .cake-template').remove();


            new Splide('[data-container=classic]', {
                type:'fade',
                rewind:true,
                arrows:false,
                autoplay:true,
                // fixedHeight:'384px',
                // // fixedWidth:'12rem',
                // perMove:1,
                // perPage:3,
            }).mount();

            new Splide('[data-container=variant]', {
                type:'fade',
                rewind:true,
                arrows:false,
                autoplay:true,
                // fixedHeight:'384px',
                // fixedWidth:'12rem',
                interval:5100,
                // perMove:1,
                // perPage:3,
            }).mount();

            
        }
    },
    subscribe:{
        'main-section':{
            renderSlides(datas){
                console.log(datas);
                this.render({ emit:datas});
            },
            destroySlide(){
                this.fire.destroy();
            }
        }
    },
});