

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
        login:'https://qa.bingorepublic.com.ph/oauth/authorize?client_id=5&redirect_uri=https://lucky888bet.herokuapp.com/login-callback&response_type=code&scope&state=asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf',
        signup:'https://qa.bingorepublic.com.ph/registration',
        deposit:'https://qa.bingorepublic.com.ph/player/deposit',
    });
    
})(window, 'production');
