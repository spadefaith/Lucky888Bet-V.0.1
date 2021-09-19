require('dotenv').config();
const jwt = require('jsonwebtoken');

function _getToken(cookie, referer){
    cookie = cookie.split(" ").join("");
    let split = cookie.split(';');
    let token = null;
    for (let s = 0; s < split.length; s++){
        let [p, _token] = split[s].split('=');
        if (referer == p){
            token = _token;
            break;
        } else { 
            continue 
        };
    };
    return token;
}

const ensureToken = function({referer, cookie}){
    return new Promise((res,rej)=>{
 
        try {
            const token = _getToken(cookie, referer);
            // if (!token){rej(new Error(`no token`)); return}; 
            
            // console.log("🚀 ~ file: ensure-token.js ~ line 25 ~ returnnewPromise ~ token", jwt.decode(token),8);
            if (token){ 
                jwt.verify(token, process.env.SECRET, function(err, user){
                     
                    if (err){ 
                        throw new Error(err.message);
                    } else {
                        res(user);
                    };
                });
            } else {
                res(null);
            }
        } catch(err){ 
            //reset token 
            jwt.sign({hello:'world'},process.env.SECRET, { expiresIn: '0h' });
            rej(err) 
        };
    });
};


module.exports = ensureToken;