const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// route to serve homepage
router.get('/', async (req, res) => {
  try {
    // Get all posts and include associated user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize the post data so the handlebars template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // render homepage template, passing posts and session login status
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to serve a specific post by ID
router.get('/post/:id', async (req, res) => {
  try {
    // retrieve a single post by ID and incl association
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
            }
          ]
        },
      ],
    });

    // serialize the post data
    const post = postData.get({ plain: true });

    //render the post template, passing post data and session login status
    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// route to serve the user dashboard, protected with authentication
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // retrieve the logged in user based on the session ID, excluding pw
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    //serialize the user data
    const user = userData.get({ plain: true });

    // render the dashboard template, passing the user data
    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//route for login page
router.get('/login', (req, res) => {
  // If the user is logged in, redirect the request to dashboard
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }
  //render the login page template
  res.render('login');
});

module.exports = router;
