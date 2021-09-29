const express = require('express');
const cors = require('cors');
const device = require('express-device');
const fs = require('fs');
const fetch = require('node-fetch');
const storage = require('./router/storage');
const global = require('./global');

// const helmet = require('helmet');

const port = process.env.PORT || 7766;
const app = express();


app.use(device.capture());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// app.use(helmet.frameguard({action:'deny'}));

let isLoggedIn = false;


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
        console.log(req.Token, 71);
        res.json(req.Token);
});

app.get('/getPlayer', function(req, res, next){

        let user = storage.getByToken(req.query.token);
        console.log(user, 78);
        if (user){
                res.json(user);
        } else {
                res.json({m:'message'});
        };
});



// app.use('/login',require('./router/create-token'),require('./router/user-logged-in') );

app.use('/login', function(req, res, next){
        // console.log(req.body);
        let {username, password} = req.body;
        let cred = {
                username:(username == 'a')?"BRCL000013":username,
                password:(password == 'a')?"WQK62E":password,
        };


        fetch(global.login, {
                method:'POST',
                body:JSON.stringify(cred),
                headers: {'Content-Type': 'application/json'}
        }).then(r=>{
                return r.json();
        }).then(r=>{
                // console.log(r, 99);
                r.user.username = cred.username;
                // console.log(r, 99);
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
app.use('/logout',require('./router/get-token'),function(req, res, next){
        fetch(global.logout, {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({token:req.Token}),
        }).then(r=>{
                return r.json();
                
        }).then(r=>{
                
                console.log(r);

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
                res.json({m:'s'})
        }).catch(err=>{
                console.log(err.message);
        });
});
 
app.post('/sendotp', function(req, res, next){
        let o = {
                member_id:req.body.username,
        }
        fetch(global.sendotp, {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify(o),
        }).then(r=>{
                return r.json();
        }).then(r=>{
                res.json(r);
        }).catch(err=>{
                console.log(err.message);
        });
});

app.post('/stat', function(req, res, next){
        // console.log(req.body);
        res.json({status:1});
        next()
});

app.use('/asset', require('./asset'));



app.listen(port, '0.0.0.0',function(err){
        if (err) console.log(err);
        console.log("Server listening on PORT", port);
});

