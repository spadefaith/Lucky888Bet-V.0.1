Cakes.create('alert', null, {
    handlers:{},
    subscribe:{
        alertSuccess:{
            components:['login', 'login-otp', 'model-remote'],
            handler(e){
                swal.fire({
                    title:'Success',
                    message:e || 'successfully',
                    icon:'success',
                });
            },
        },
        alertError:{
            components:['login', 'login-otp', 'model-remote'],
            handler(e){
                swal.fire({
                    title:'Error',
                    message:e || 'An error occured',
                    icon:'error',
                });
            },
        },
        alertWarning:{
            components:['login', 'login-otp', 'model-remote'],
            handler(e){
                swal.fire({
                    title:'Warning',
                    message:e || 'Be carefull',
                    icon:'warning',
                });
            },
        },
        alertInfo:{
            components:['login', 'login-otp', 'model-remote'],
            handler(e){
                swal.fire({
                    title:'Info',
                    message:e || 'Informative',
                    icon:'info',
                });
            },
        },
    },
});