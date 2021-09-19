require('dotenv').config();
const jwt = require('jsonwebtoken');

const resetToken = function(){
    return token = jwt.sign({hello:'world'},process.env.SECRET, { expiresIn: '0h' });
    
};

module.exports = resetToken;
