Cakes.create('modal', '#modal', {
    root:'[name=modal-container]',
    handlers:{
        isConnected(e){
            let {emit, element} = e;
            this.fire('openFrame', element);
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