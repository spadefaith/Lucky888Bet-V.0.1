const fetch = require('node-fetch');
const url = 'https://script.google.com/macros/s/AKfycbzWuqBZBFHw065D6E-nE8jTzl-St-ehppUtt6wnLxII3YNszzhx6_nIjwSWV7VJCHQ9ug/exec'
const controller = require('./config/controller');



exports.register = function(req, res, next){
    
    let body = req.body;
    controller('auth','query',{email:body.email}).then(r=>{
        if (r){
            res.json({error:'Duplicate Email Found!'});
        } else {
            fetch(url, {
                method:'POST',
                mode: 'cors',
                header:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({email:body.email}),
            }).then(r=>{
                // console.log(r);
                return r.json();
            }).then(r=>{
                body.otp = r.otp;
                controller('auth', 'create', {data:body}).then((user)=>{
                    res.json({message:'success'});
                });
            }).catch(err=>{
                console.log(err, 26);
            })
        }
    })
};

exports.login = function(req, res, next){
    let body = req.body;
    controller('auth', 'query', {data:body}).then(r=>{
        console.log(r);
    });
}