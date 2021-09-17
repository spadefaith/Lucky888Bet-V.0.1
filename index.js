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


// app.use('/', express.static('./public/desktop1'));
app.use('/', express.static('./public/landing-page'));
app.use('/games/e-bingo', function(req, res, next){
        res.cookie('games', 'e-bingo');
        next();
},express.static('./public/lobby'));


app.use('/post', function(req, res, next){
        req.body
});

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

app.post('/api/auth/create', require('./router').register);
app.post('/api/auth/get', require('./router').login);


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

