const resetToken = require('../token/reset-token');
module.exports = function (req,res,next){
    if (req.path == '/'){
        res.cookie(
            'reset', 
            resetToken(), 
            {
                secure: true,
                httpOnly: true,
                sameSite:'strict',
            }
        );

    };
    next();
}