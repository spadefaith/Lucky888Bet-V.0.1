Cakes.create('dropdown', '#dropdown', {
    root:'.dropdown-container',
    animate:{
        drop:{
            render:{keyframes:['appear']},
            remove:{keyframes:['disappear']},
        }
    },
    handlers:{
        destroy(){
            this.reset();
            this.$scope.navOptions = null;
        },
        beforeAppended(obj){
            let {emit, element} = obj;
            // element = element.getElement()[0];
            // console.log(element)
            // element.classList.add('is-show');
            // element.classList.add('is-visible');
        },
        
        isConnected(obj){
            console.log(obj)
            let {emit, element} = obj;
            element = element.getElement();
            // console.log(element)
            // element.classList.replace('is-hidden','is-show');
            
            // element.classList.replace('is-invisible','is-visible');

            this.$scope.navOptions = emit;
        }
    },
    subscribe:{
        nav:{
            renderDrop(obj){
                console.log(obj)
                this.render({emit:obj});
            },
            destroyDrop(){
                this.fire.destroy();
            },
        }
    },
});