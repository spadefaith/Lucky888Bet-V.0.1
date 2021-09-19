const jwt = require('jsonwebtoken');
const users = require('./storage');


// const controller = require('../controller/controller-auth');


module.exports = function (req, res, next){
    let result = req.body;
    // console.log(result);
    try{
        if (result){
            let d = result;
            let loggedin = users.getById(d._id);
            if (loggedin != undefined){
                throw new Error(`the user is already logged in`);
            } else { 
                let token = jwt.sign(result,process.env.SECRET, { expiresIn: '8h' });
                // console.log(jwt.decode(token), 19);
                // console.log(token, 19)
                res.cookie('bearer-secure', token, {
                    secure: true, 
                    httpOnly: true,
                    sameSite:'strict',
                });
                res.cookie('bearer-not-secure', token, {
                    secure: false, 
                    httpOnly: false,
                    sameSite:'strict',
                });
                res.locals.user = result;
                res.json({status:200, data:result});
            }
    
        } else {
            throw new Error(`not registered`);
        }
        next();
    } catch(err){
        next(err);
    };
}