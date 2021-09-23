Cakes.create('modal', '#modal', {
    root:'[name=modal-container]',
    handlers:{
        destroy(e){
            this.reset();
        },
        isConnected(e){
            let {element, emit:{trigger}} = e;
            let fn = this.utils.createFn('render'+trigger);
            this.fire('render'+trigger);
        },
    },
    subscribe:{
        'render-modal':{
            components:['header'],
            handler(e){
                this.render({hashed:true, emit:{trigger:e}});
            },
        },
        header:{
            renderLogin(e){
                this.render({hashed:true, emit:{trigger:e}});
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
            _destroy(e){
                this.fire.destroy();
            }
        }
    },
});