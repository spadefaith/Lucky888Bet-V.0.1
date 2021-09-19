
module.exports = function(req,res,next){
    let referer = 'bearer-not-secure';
 
 
    if (req.path == '/'){
        let cookie = req.headers.cookie;
        // console.log(cookie); 
        require('../token/ensure-token')({cookie, referer}).then(user=>{
            req.User = user;
            // console.log(user, 8);
            next();
        }).catch(err=>{
            // next(err);
            next()
        });
    } else {
        next();
    };
};