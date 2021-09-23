function _getToken(cookie, referer){
    let token = null;
    if (cookie){
        cookie = cookie.split(" ").join("");
        let split = cookie.split(';');
        for (let s = 0; s < split.length; s++){
            let [p, _token] = split[s].split('=');
            if (referer == p){
                token = _token;
                break;
            } else { continue };
        };
    }
    return token;
}


module.exports = _getToken;