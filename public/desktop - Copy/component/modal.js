Cakes.create('modal', '#modal', {
    root:'main',
    animate:{
        modal:{
            render:{keyframes:['slideInLeft'], options:{duration:500}},
            remove:{keyframes:['slideOutLeft'],options:{duration:300}},
            
        },
    },
    handlers:{
        destroy(e){
            // console.log('here');
            this.reset();
            let fnName = `destroy${this.data.caller}`;
            console.log(fnName);
            this.fire(this.utils.createFn(fnName, this.data.caller));
        },
        isConnected(obj){ 
            let emit  = obj.emit;
            if (emit && emit.caller){
                this.data.caller = emit.caller;
;
                switch (emit.caller){
                    case 'signup':{
                        this.fire(function renderRegisterForm(){return {caller:emit.caller}});
                    } break;
                    case 'login':{
                        this.fire(function renderLoginForm(){return {caller:emit.caller}});
                    } break;
                }
            };

            if (this.data.caller == 'login'){
                this.$scope.formTitle = 'Login Form'
            } else if (this.data.caller == 'signup'){
                this.$scope.formTitle = 'Registration Form'
            }
 
            let el = this.html.el[0];
            let modal = new bootstrap.Modal(el, {
                backdrop:true,
                focus:true,
            });
            el.addEventListener('hidden.bs.modal',(e)=>{

                this.fire.destroy(null, true);
            })
            modal.toggle();
        },
    },
    subscribe:{
        nav:{
            renderlogin(e){
                this.render({hashed:true,emit:{caller:'login', }});
            },
            rendersignup(e){
                this.render({hashed:true,emit:{caller:'signup', }});
            },
        }

    },
});