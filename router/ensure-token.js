
module.exports = function(req,res,next){
    let referer = null;
    if (req.path == '/'){
        referer = req.baseUrl;
    };
    if (req.baseUrl == '/api'){
        referer = req.headers.referer;
    }
    
    if (!referer){next(); return};
    // console.log(req.path,12);
    // console.log(referer,13)

    let cookie = req.headers.cookie;
    // console.log(cookie)

    if (['/auth/validateAdmin', '/auth/registerUser'].includes(req.path)){
        req.User = {password:'cedrick'};
        next();
    } else {
        require('../token/ensure-token')({cookie, referer}).then(user=>{
            // console.log(user,17);
            req.User = user;
            next();
        }).catch(err=>{
            // console.log(err,22)
            next(err);
        });
    }


}