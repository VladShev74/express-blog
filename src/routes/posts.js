const express = require('express');
const router = express.Router();
const { schemaValidate } = require('../middlewares');
const { postsValidator } = require('../validationSchemas');

const { auth } = require('../middlewares');
const { Tags, Posts } = require('../models');

// respond with "hello world" when a GET request is made to the homepage
router.get('/', async (req, res, next) => {
  try {
    const posts = await Posts.find().populate('tags').populate('author');

    return res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId)
      .populate('tags')
      .populate('author');

    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post(
  '/',
  schemaValidate(postsValidator.postCreate),
  auth,
  async (req, res, next) => {
    try {
      let new_tags = [];
      let existing_tags = [];
      if (req.body.tags) {
        const tags_array = req.body.tags.split(', ');
        existing_tags = await Tags.find({
          name: { $in: tags_array },
        });
        const filtered_tags = tags_array.filter((el) => {
          return !existing_tags.find((tag) => {
            return tag.name === el;
          });
        });

        new_tags = await Tags.insertMany(
          filtered_tags.map((el) => {
            return { name: el };
          })
        );
      }

      const new_post = await Posts.create({
        ...req.body,
        tags: [...existing_tags, ...new_tags],
        author: req.user.id,
      });

      req.user.posts.push(new_post);

      await new_post.populate('tags');
      await req.user.save();
      return res.json(new_post);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.put(
  '/:postId',
  schemaValidate(postsValidator.postUpdate),
  auth,
  async (req, res, next) => {
    const { postId } = req.params;
    try {
      const post = await Posts.findById(postId);
      if (post.author !== req.user.id) {
        return res.status(403).json({
          message: 'bad author',
        });
      }
      const updated_post = await Posts.findByIdAndUpdate(postId, req.body, {
        new: true,
      });

      return res.json(updated_post);
    } catch (error) {
      res.status(500).send({ message: 'error' });
      console.log(error);
    }
  }
);

router.delete('/:postId', auth, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId);
    if (post.author !== req.user.id) {
      return res.status(403).json({
        message: 'bad author',
      });
    }

    const post_toDel = await Posts.findByIdAndDelete(postId);
    return res.json(post_toDel);
  } catch (error) {
    res.status(500).send({ message: 'error' });
    console.log(error);
  }
});

router.patch('/:postId/like', auth, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId);

    const isLike = req.user.likedPosts.includes(postId);

    if (isLike) {
      post.usersLiked--;
      req.user.likedPosts.pull(postId);
    } else {
      post.usersLiked++;
      req.user.likedPosts.push(postId);
    }

    await post.save();
    await req.user.save();

    return res.json(post);
  } catch (error) {
    res.status(500).send({ message: 'error' });
    console.log(error);
  }
});

router.patch('/:postId/save', auth, async (req, res, next) => {
  const { postId } = req.params;
  try {
    // add to user array
    const post = await Posts.findById(postId);

    const isRead = req.user.readingList.includes(postId);

    if (isRead) {
      post.usersReading--;
      req.user.readingList.pull(postId);
    } else {
      post.usersReading++;
      req.user.readingList.push(postId);
    }

    await post.save();
    await req.user.save();

    return res.json(post);
  } catch (error) {
    res.status(500).send({ message: 'error' });
    console.log(error);
  }
});

module.exports = router;
