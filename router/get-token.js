let _token = null;
module.exports = function(req, res ,next){
    if (req.path == '/'){
        let cookie = req.headers.cookie;
        let referer = 'bearer-not-secure';
        let token = require('../token/get-token')(cookie, referer);
        // console.log(cookie)
        if (_token != token){
            _token = token;
        };
    };
    req.Token = _token;
    next();
};