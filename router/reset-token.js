const resetToken = require('../token/reset-token');
module.exports = function (req,res,next){
    // console.log(req.path)
    if (req.path == '/'){
        res.cookie(
            'bearer-secure', 
            resetToken(), 
            {
                secure: true,
                httpOnly: true,
                sameSite:'strict',
            }
        );
        res.cookie(
            'bearer-not-secure', 
            resetToken(), 
            {
                secure: false,
                httpOnly: false,
                sameSite:'strict',
            }
        );

    };
    next();
}