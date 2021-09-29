Cakes.create('modal', '#modal', {
    root:'[name=modal-container]',
    handlers:{
        destroy(e){
            // console.log(e);
            this.reset();
        },
        isConnected(e){
            let {element, emit:{trigger}} = e;
            let fn = this.utils.createFn('render'+trigger);
            if (trigger.includes('frame')){

                this.fire('render-'+trigger, trigger);
            } else {

                this.fire('render'+trigger, trigger);
            }
        },
    },
    subscribe:{
        'render-modal':{
            components:['header'],
            handler(e){
                this.render({hashed:true, emit:{trigger:e}});
            },
        },
        renderFrame:{
            components:['header'],
            handler(e){
                this.render({hashed:true, emit:{trigger:`${e}-frame`}});
            },
        },
        renderLogin:{
            components:['header','category'],
            handler(e){
                this.render({hashed:true, emit:{trigger:'login'}});

            }
        }, 
        app:{
            renderPop(e){
                this.render({hashed:true, emit:{trigger:'pop'}});
            }
        },
        destroyModal:{
            components:['pop'],
            handler(e){
                this.fire.destroy();
            }        
        },
        pop:{
            // _destroy(e){
            //     this.fire.destroy();
            // },          
            destroy(e){
                this.fire.destroy(null, false);
            }
        }
    },
});