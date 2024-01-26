//import necessary modules and classes
const router = require('express').Router();
const { User } = require('../../models');


// post route for creating a new user
router.post('/', async (req, res) => {
  try {
    // create a new user using data from the request body
    const userData = await User.create(req.body);

    // save the session and set user info in the session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // send user data as a response
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// post route for user login
router.post('/login', async (req, res) => {
  try {
    // find user by username
    const userData = await User.findOne({ where: { username: req.body.username } });

    //check if user exists
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // check if provided pw is correct
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // save session and set user info in the session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      //send a success message along with user data
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// post route for user logout
router.post('/logout', (req, res) => {
  //check if user logged in
  if (req.session.logged_in) {
    // destroy the session and end response
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
