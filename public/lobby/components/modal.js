Cakes.create('modal', '#modal', {
    root:'[name=modal-container]',
    handlers:{
        destroy(e){
            this.reset();
        },
        isConnected(e){
            let {emit, element} = e;
            this.fire('openFrame', this.container.content);
        }
    },
    subscribe:{
        lobby:{
            openModal(e){
                this.render({hashed:true});
            }
        }
    },
});