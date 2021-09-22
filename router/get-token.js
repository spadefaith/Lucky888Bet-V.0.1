module.exports = function(req, res ,next){
    let cookie = req.headers.cookie;
    let referer = 'bearer-not-secure';
    // console.log(cookie, referer);
    let token = require('../token/get-token')(cookie, referer);
    
    req.Token = token;
    next();
};