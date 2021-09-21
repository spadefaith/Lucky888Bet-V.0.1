const express = require('express');
const cors = require('cors');
const multer = require('multer');
const device = require('express-device');
const cherio = require('cherio');
const fs = require('fs');


// const helmet = require('helmet');

const port = process.env.PORT || 7766;
const app = express();


app.use(device.capture());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// app.use(helmet.frameguard({action:'deny'}));

let isLoggedIn = false;

// app.use('/', express.static('./public/desktop1'));
app.use('/',require('./router/ensure-token'),function(req, res, next){
        if (req.path == '/' && !!req.User){
                isLoggedIn = (req.User.username && req.User.password);
        };
        if (isLoggedIn){

                express.static('./public/landing-page-user')(req, res, next);
        }else {
                Promise.resolve().then(()=>{
                        
                        // require('./router/store-token')(req, res, next);
                }).then(()=>{
                        express.static('./public/landing-page')(req, res, next);

                })
        };
} );

app.use('/games/e-bingo/:user',express.static('./public/lobby'));

app.use('/player',require('./router/ensure-token'), function(req, res, next){
        console.log(req.cookies, 46);
        res.json(req.User);
});

app.use('/login',require('./router/create-token'),require('./router/user-logged-in') );
app.use('/logout',require('./router/reset-token'), );
 
app.use('/games/e-bingo/:game',function(req, res, next){
        let path = './public/game-container/index.html';
        fs.readFile(path, 'utf-8', function(err, html){
                let $ = cherio.load(html);
                $('iframe').attr('src', 'http://localhost:7777/'); 
                fs.writeFile(path, $.html(), function(err){
                        if (err){
                            console.log(err);
                        }
                        //change the html;
                        // res.setHeader('Content-Encoding', 'gzip');
                        next();
                });
        });
        
}, express.static('./public/game-container'));

app.post('/stat', function(req, res, next){
        console.log(req.body);
        res.json({status:1});
        next()
});

app.use('/asset', require('./asset'));



app.listen(port, '0.0.0.0',function(err){
        if (err) console.log(err);
        console.log("Server listening on PORT", port);
});

