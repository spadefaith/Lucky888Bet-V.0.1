Cakes.create('login-form', '#login', {
    root:'.modal-content',
    handlers:{
        login(e){
            let data = new FormData(e.target);
            let o = {};
            for (let [key, value] of data.entries()){
                o[key] = value;
            };
            console.log(o);
        },
        submit(e){
            let data = new FormData(e.target);
            let o = {}; 
            for (let [key, value] of data.entries()){ 
                o[key] = value;
            }; 
            // console.log(o)
            return o;
        }
    },
    subscribe:{
        modal:{
            renderlogin(e){
                this.render();
            }
        }
    },
});