Cakes.create('pop', '#pop', {
    root:'.modal-content',
    handlers:{
        destroy(e){
            this.reset();
        },
        click(e){
            let target = e.target;
            console.log(target.dataset.name == 'yes');
            if (target.dataset.name == 'yes'){
                this.fire(function validateAge(){});
                this.fire(function destroyModal(){});
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
                this.render();
            }
        }
    },
})