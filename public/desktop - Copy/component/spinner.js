Cakes.create('spinner', '#spinner', {
    handlers:{
        destroy(){
            return this.reset();
        }
    },
    subscribe:{
        spinnerDestroy:{
            components:['table', 'profile','model-remote', 'model-local', 'form', 'notify', 'socket'],
            handler(){
                setTimeout(()=>{
                    this.fire.destroy();
                }, 100);
            }
        },
        spinnerRender:{
            components:['profile','radio', 'form'],
            handler(){
                this.render();
            }
        },
        alertClosed:{
            components:['alert'],
            handler(){
                setTimeout(()=>{
                    this.fire.destroy();
                }, 400);
            }
        }
    },
});

