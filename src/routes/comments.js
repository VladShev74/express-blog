const express = require('express');
const router = express.Router();
const { commentsValidator } = require('../validationSchemas');
const { schemaValidate } = require('../middlewares');

const { auth } = require("../middlewares");
const { Comment, Posts } = require("../models");

// POST /comments - Create new comment for the post
// PUT /comments/:commentId - Edit existing comment by it's author
// PATCH /comments/:commentId/like - Like existing comment
// DELETE /comments/:commentId - Delete existing comment

router.post(
  '/',
  schemaValidate(commentsValidator.commentCreate),
  auth,
  async (req, res, next) => {
    // auth
    try {
      const new_comment = await Comment.create({...req.body, author: req.user._id}); //  author: req.user.id     

      const targetPost = await Posts.findById(req.body.ParentPost);
      targetPost.comments.push(new_comment);
      await targetPost.save();
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
});

router.put(
  '/:commentId',
  schemaValidate(commentsValidator.commentUpdate),
  auth,
  async (req, res, next) => {
    const { commentId } = req.params;
    try {
      const comment = await Comment.findById(commentId);
      console.log(comment.author.toString());
      console.log(req.user.id);
      if (comment.author.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'bad author',
        });
      }
      const updated_comment = await Comment.findByIdAndUpdate(
        commentId,
        req.body,
        {
          new: true,
        }
      );

      return res.json(updated_comment);
    } catch (error) {
      res.status(500).send({ message: 'error' });
      console.log(error);
    }
  }
);

router.patch('/:commentId/like', auth, async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);

    const isLike = req.user.likedComments.includes(commentId);

    if (isLike) {
      comment.likes--;
      req.user.likedComments.pull(commentId);
    } else {
      comment.likes++;
      req.user.likedComments.push(commentId);
    }

    await comment.save();
    await req.user.save();

    return res.json(comment);
  } catch (error) {
    res.status(500).send({ message: 'error' });
    console.log(error);
  }
});

router.delete('/:commentId', auth, async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'bad author',
      });
    }

    const comment_toDel = await Comment.findByIdAndDelete(commentId);
    return res.json(comment_toDel);
  } catch (error) {
    res.status(500).send({ message: 'error' });
    console.log(error);
  }
});

module.exports = router;
