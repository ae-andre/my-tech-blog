// import necessary modules and classes
const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// post route for creating a new post
router.post('/', withAuth, async (req, res) => {
  try {
    // create new post using data from the request
    // attaching user_id from the session to associated post
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    // send back created post as a json response
    res.status(200).json(newPost);
  } catch (err) {
    // if error
    res.status(400).json(err);
  }
});

//put route for updating an existing post
router.put('/:id', withAuth, async (req, res) => {
  try {
    // updating the post specified by the ID in the request
    // update only applies to post made by the user

    const postData = await Post.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      }
    });

    // if no post found, error
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});


//delete route for deleting posts
router.delete('/:id', withAuth, async (req, res) => {
  try {
    //deleting the post specified by the ID in the request
    //delete only applies to the post made by the user
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// export router to be used elsewhere in app
module.exports = router;
