const express = require('express');
const router = express.Router();
const auth = require('../routes/verifyToken');

router.get('/', auth, (req, res)=>{
    res.json(req.user);

});

module.exports = router;