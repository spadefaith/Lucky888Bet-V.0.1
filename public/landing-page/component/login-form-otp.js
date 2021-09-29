Cakes.create('login-form-otp', '#login-otp', {
    root:'.modal-content',
    handlers:{
        isConnected(e){
            let {emit:{data:{payload:{username, password}, response}}} = e;
            console.log(username, password, response);
            this.$scope.username = username;
            this.$scope.reference = response.otp.ref_no;
            this.$scope.number = response.otp.sent_to;

            this.fire('spinnerDestroy');
        },
        submit(e){
            let data = new FormData(e.target);
            let o = {}; 
            for (let [key, value] of data.entries()){ 
                o[key] = value;
            };
            return o;
        }
    },
    subscribe:{
        'login-form':{
            renderOtpVerify(e){
                this.render({emit:{data:e}});
            }
        }
    },
});