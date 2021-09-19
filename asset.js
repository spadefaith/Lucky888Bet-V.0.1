const express = require('express');
const router = express.Router();


router.get('/fields.js', function(req, res, next){
    res.sendFile(__dirname+'/config/fields.js');
});


router.get('/swal.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/swal/swal.js');
});

router.get('/bundled.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/bundled.js');
});
router.get('/bundled-min.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/bundled-min.js');
});


router.get('/cake.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes-min/cake.js');
});

router.get('/cake-utils.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-utils.js');
});

router.get('/cake-env.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-env.js');
});

router.get('/cake-pollyfill.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-utils.js');
});

router.get('/cake-attributes.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-attributes.js');
});

router.get('/cake-component.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-component.js');
});

router.get('/cake-components.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-components.js');
});

router.get('/cake-databinding.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-databinding.js');
});

router.get('/cake-form.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-form.js');
});

router.get('/cake-hash.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-hash.js');
});

router.get('/cake-mo.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-mo.js');
});

router.get('/cake-observer.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-observer.js');
});

router.get('/cake-persist.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-persist.js');
});

router.get('/cake-piece.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-piece.js');
});

router.get('/cake-prototype.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-prototype.js');
});

router.get('/cake-ram.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-ram.js');
});

router.get('/cake-storage.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-storage.js');
});

router.get('/cake-template-proto.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-template-proto.js');
});

router.get('/cake-templates.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-templates.js');
});

router.get('/cake-worker.js', function(req, res, next){
    res.sendFile(__dirname+'/local_modules/cakes/cake-worker.js');
});

module.exports = router;