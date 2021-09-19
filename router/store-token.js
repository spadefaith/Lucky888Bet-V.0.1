const users = require('./storage');
// console.log(users);
module.exports = function(req, res,next){
    if (req.User){
        let user = req.User;
        user._id = new Date().toLocaleDateString();
        users.set(user);
        // console.log(users.getAll());
    }
    next();
};
