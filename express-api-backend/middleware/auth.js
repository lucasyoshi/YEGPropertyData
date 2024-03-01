var express = require('express');
var router = express.Router();
var login = require('../routes/login'); // replace with the path to your login function

// Login route
router.post('/login', login);

module.exports = router;