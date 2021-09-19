const jwt = require('jsonwebtoken');

const resetToken = function(){
    return token = jwt.sign({hello:'world'},'micro', { expiresIn: '0h' });
    
};

module.exports = resetToken;
