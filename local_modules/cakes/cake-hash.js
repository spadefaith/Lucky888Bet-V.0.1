//it extends the user interaction to close button;
//it uses the back button to close a certain ui;
//the ui is renderedAsync, with option of hash;
//so that it can be close using the back button;

class Hasher{
    constructor(Components){
        this.Components = Components;

    }
    listen(){
        window.addEventListener('hashchange',(e)=>{
           //when rendered add will be called;
           //when removed remove will be called;
           //here whem removed is called;
           //the component will get notified; 
           

           //compare from prev get the missing in current from prev;
           let hit = this.compare(e);
           this.find(hit, this.notify);
        });
    }
    compare(e){
        //the comparison will work only in remove;
        //since, the renderAsync will handle it;
        let {oldURL, newURL} = e;
        let hit = null; 
        if (oldURL.length > newURL.length){
            let prev = new URL(oldURL).hash.substring(1).split('/');
            let next = new URL(newURL).hash.substring(1).split('/');
             
            for (let p = 0; p < prev.length; p++){
                if (!next.includes(prev[p])){
                    hit = prev[p];
                    break;
                };
            };
        }; 
        return hit;
    }
    find(name, cb){ 
        if (!name) return;
 
        if (!this.Components[name]){
            let lk = setInterval(()=>{
                
                if (this.Components[name]){
                    if(this.Components[name].isConnected){
                        cb(this.Components[name]);
                    };
                    clearTimeout(lk);
                };
            },50);
            //loophole catcher;
            setTimeout(()=>{
                clearTimeout(lk);
            },5000);
        } else {
            if(this.Components[name].isConnected){
                cb(this.Components[name]);
            };
        };
    }
    notify(component){
        component.fire.destroy();
    }
    add(componentName){
        let hash = location.hash;
        if (!hash.includes(componentName)){
            location.hash = hash+'/'+componentName;
        };
    }
    remove(componentName){
        let hash = location.hash
        let removed = hash.replace(componentName, "");
        location.replace(removed);
    }
};