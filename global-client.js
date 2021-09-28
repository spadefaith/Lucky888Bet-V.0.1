

(function(global, type){
    global.cfg = {};
    if (type == 'production'){
        global.cfg.home = `https://lucky888bet.herokuapp.com`;
        global.cfg.game = `http://3.133.4.140:5000`;
    } else if (type == 'development'){
        global.cfg.home = `http://localhost:7766`;
        global.cfg.game = `http://localhost:7778`;
    };

    Object.assign(global.cfg, {
        login:'http://qa.bingorepublic.com.ph/login',
        signup:'http://qa.bingorepublic.com.ph/registration',
    });
    
})(window, 'production');
