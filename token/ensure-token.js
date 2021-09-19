const jwt = require('jsonwebtoken');

function _getToken(cookie, referer){
    cookie = cookie.split(" ").join("");
    let split = cookie.split(';');
    let token = null;
    // console.log(split, referer)
    for (let s = 0; s < split.length; s++){
        let [p, _token] = split[s].split('=');
        if (referer.includes(p)){
            token = _token;
            break;
        } else { continue };
    };
    // console.log(cookie, referer)
    return token;
}

const ensureToken = function({referer, cookie}){
    return new Promise((res,rej)=>{
        // console.log(bearer)
        try {
            const token = _getToken(cookie, referer);
            if (!token){rej(new Error(`no token`)); return};
            jwt.verify(token, 'micro', function(err, user){
                // console.log(token,13);
                // console.log(cookie,14);
                // console.log(user);
                if (err){ 
                    rej(err);
                } else {
                    res(user);
                };
            });
        } catch(err){ rej(err) };
    });
};


module.exports = ensureToken;