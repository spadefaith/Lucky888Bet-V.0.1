;class Persistent{
    constructor(){
        this.storage = new StorageKit({
            storage:sessionStorage,
            name:'_cake_persistent',
            id:false,
        });
    }
    listen(components){
        // console.log(components)
        window.addEventListener('DOMContentLoaded', (e)=>{
            setTimeout(()=>{
                this.storage.getAll().then(result=>{
                    if (!result.length) return;
                    // console.log(result);
                    for (let r = 0; r < result.length; r++){
                        let item = result[r];
                        let component = components[item];
                        
                        if (component){
                            !component.isConnected && component.render.bind(component)();
                        } else {
                            console.error(`component ${component} is not found!`)
                        }
                    };
                })
            })
        });
    }
    append(name){
        this.storage.create(name);
    }
    remove(name){
        this.storage.remove(name);
    }
};