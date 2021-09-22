function _getToken(cookie, referer){
    cookie = cookie.split(" ").join("");
    let split = cookie.split(';');
    let token = null;
    // console.log(split, referer)
    for (let s = 0; s < split.length; s++){
        let [p, _token] = split[s].split('=');
        if (referer == p){
            token = _token;
            break;
        } else { continue };
    };
    // console.log(cookie, referer)
    return token;
}


module.exports = _getToken;