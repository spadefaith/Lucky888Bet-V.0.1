const express = require('express');
const cors = require('cors');
const multer = require('multer');
const device = require('express-device');
const cherio = require('cherio');
const fs = require('fs');
const fetch = require('node-fetch');
const storage = require('./router/storage');

// const helmet = require('helmet');

const port = process.env.PORT || 7766;
const app = express();


app.use(device.capture());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// app.use(helmet.frameguard({action:'deny'}));

let isLoggedIn = false;


// app.use('/',require('./router/ensure-token'),function(req, res, next){
//         if (req.path == '/' && !!req.User){
//                 isLoggedIn = (req.User.username && req.User.password);
//         };
//         if (isLoggedIn){

//                 express.static('./public/landing-page-user')(req, res, next);
//         }else {
//                 Promise.resolve().then(()=>{
                        
//                         // require('./router/store-token')(req, res, next);
//                 }).then(()=>{
//                         express.static('./public/landing-page')(req, res, next);

//                 })
//         };
// } );

app.use('/',require('./router/get-token'),function(req, res, next){
        let user = storage.getByToken(req.Token);

        if (user == null){
                //reset token;
                //landing page;
                res.cookie('bearer-secure', 'reset', {
                        secure: true, 
                        httpOnly: true,
                        sameSite:'strict',
                });
                res.cookie('bearer-not-secure', 'reset', {
                        secure: false, 
                        httpOnly: false,
                        sameSite:'strict',
                });
                express.static('./public/landing-page')(req, res, next);
        } else if (user){
                //user page;

                express.static('./public/landing-page-user')(req, res, next);
        };
});

app.use('/games/e-bingo/:user',express.static('./public/lobby'));

app.use('/player',require('./router/get-token'), function(req, res, next){

        res.json(req.Token);
});

// app.use('/login',require('./router/create-token'),require('./router/user-logged-in') );

app.use('/login', function(req, res, next){
        // console.log(req.body);
        fetch('https://qa.bingorepublic.com.ph/api/login', {
                method:'POST',
                body:JSON.stringify(req.body),
                headers: {'Content-Type': 'application/json'}
        }).then(r=>{
                return r.json();
        }).then(r=>{
                storage.set(r.user.id, r);

                res.cookie('bearer-not-secure', r.access_token, {
                        secure: false, 
                        httpOnly: false,
                        sameSite:'strict',
                });
                res.cookie('bearer-secure', r.access_token, {
                        secure: true, 
                        httpOnly: true,
                        sameSite:'strict',
                });
                next()
        }).catch(err=>{
                next()
        });
});
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

