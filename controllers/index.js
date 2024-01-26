// Importing the necessary module and route handlers
const router = require('express').Router();

// Importing route handlers for different paths
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// Mounting homeRoutes on the root path /
// doing this means any request to root URL will be handled by homeRoutes
router.use('/', homeRoutes);

// Mounting apiRoutes on the path '/api'
// doing this means any request starting with /api will be handled by apiRoutes
router.use('/api', apiRoutes);

module.exports = router;
