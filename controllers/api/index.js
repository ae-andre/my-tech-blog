// import modules and route files
const router = require('express').Router();

// import separate route modules for users, posts, and comments
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');

//mount the user routes at the /users path
//any request to /users will be directed to userRoutes
router.use('/users', userRoutes);

//same as above, but for posts
router.use('/posts', postRoutes);

//again same, but for comments
router.use('/comments', commentRoutes);


//export configured router to be used in main server
module.exports = router;
