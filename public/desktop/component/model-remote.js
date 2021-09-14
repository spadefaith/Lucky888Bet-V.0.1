
Cakes.create('model-remote', null, {
    type:'model',
    utils(){
        this.request = function(tbl, method, obj){
            return fetch(`/api/${tbl}/${method}`, {
                mode:'cors',
                credentials:'include',
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(obj),
            }).then(r=>{
                return r.json();
            }).then(r=>{
                if (r.error){
                    throw new Error(r.error);
                }
                return r;
            }).catch(err=>{
                swal.fire({
                    title:'Error',
                    text:err.message,
                    icon:'error',
                })
            });
        };
    },
    handlers:{},
    subscribe:{
        'step-form':{
            formSubmit(obj){
                console.log(obj);
                this.utils.request('auth','create',obj).then(result=>{
                    if (result.message){
                        swal.fire({
                            title:'Success',
                            text:'Successful registration',
                            icon:'success',
                        })
                    }
                })
            }
        }
    },
})