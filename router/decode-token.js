
const users = require('../users/users');


module.exports = function(req, res, next){
    let referer = null;
    if (req.path == '/'){
        referer = req.headers.referer;
    };
    if (req.baseUrl == '/api'){
        referer = req.headers.referer;
    };
    if (req.path == '/admin' || req.path == '/admin/'){
        referer = '/admin';
    };
    if (req.path == '/ao' || req.path == '/ao/'){
        referer = '/ao';
    };
    if (req.path == '/manager' || req.path == '/manager/'){
        referer = '/manager';
    };
    // console.log(req,84);

    // console.log(referer);

    if (!referer){next(); return};
    // console.log(referer);
    let cookie = req.headers.cookie;
    require('../token/decode-token')({referer, cookie}).then(decoded=>{
        let {_id} = decoded;
        // console.log(_id, 31);
        users.remove(_id);
        res.redirect('/')
        
    });
}