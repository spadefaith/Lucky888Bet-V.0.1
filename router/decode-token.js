
const users = require('./storage');


module.exports = function(req, res, next){
    let referer = null; 
    if (req.path == '/'){
        // referer = req.headers;
        referer = 'bearer-not-secure';
        // console.log(referer);
        if (!referer){next(); return};
        // console.log(referer);
        let cookie = req.headers.cookie;
 
        require('../token/decode-token')({referer, cookie}).then(decoded=>{
            let {_id} = decoded;
            // console.log(_id, 31); 
            // users.remove(_id);
            // res.redirect('/')
            // req.User
            req.Token = decoded;
        });
    };
    next();
     

}