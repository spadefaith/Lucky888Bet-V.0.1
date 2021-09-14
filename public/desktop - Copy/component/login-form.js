Cakes.create('login', '#login-form', {
    root:'[name=modal-content]',
    handlers:{
        destroy(e){
            this.reset();
        }
    },
    subscribe:{
        modal:{
            renderLoginForm(e){ 
                this.render();
            },
            destroylogin(){
                this.fire.destroy();
            },
        }
    },
})