;(function(global){
    global.env = {
        destructure:true,
    };
    const env = global.env;
    try {let {a} = {a:true};} catch(err){env.destructure = false};

})(window);