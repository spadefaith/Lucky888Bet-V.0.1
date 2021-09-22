let _obj = {};


exports.set = function(id, user){
    _obj[id] = user;
};

exports.getById = function(id){
    return _obj[id];
};
exports.getByRole = function(role){
    let users = [];
    for (let id in _obj){
        let user = _obj[id];
        if (user.role == role){
            users.push(user);
        };
    };
    return users;
};
exports.getByToken = function(token){
    let user = null;
    for (let id in _obj){
        let v = _obj[id];
        if (token == v.access_token){
            user = v;
            break;
        };
    };
    return user;
};

exports.removeBySocket = function(socket){
    let _id = null;
    for (let id in _obj){
        let user = _obj[id];
        if (user.socket == socket){
            // users.push(user);
            _id = id;
            break;
        };
    };
    _id && delete _obj[_id];
};

exports.remove = function(_id){
    if (_obj[_id]){
        delete _obj[_id];
    }
};
exports.setSocketId = function(_id, socket){
    let user = _obj[_id];
    user.socket = socket;
};

exports.getAll = function(){
    return _obj;
};

exports.reset = function(){
    _obj = {};
};