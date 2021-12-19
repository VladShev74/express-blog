const {User} = require('../models/User');

exports.update = async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.UserId,
        req.body,
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  exports.delete = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.UserId);
      res.json({ message: 'Show deleted' });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  exports.getById = async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.UserId)
      .populate({
        path: 'readingList',
        populate: [
          {
            path: 'author',
          },
          {
            path: 'tags',
          },
        ],
      })
      .populate('likedPosts')
      .populate('likedComments')
      .populate({
        path: 'posts',
        populate: [
          {
            path: 'author',
          },
          {
            path: 'tags',
          },
        ],
      })
      res.json(targetUser);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  exports.follow = async (req, res) => {
    try {
      const following = req.user.following.includes(req.params.UserId)
      const followUser = await User.findById(req.params.UserId)
      if(following) {
        req.user.following.pull(req.params.UserId);
        followUser.followers.pull(req.user.id)

      }

      else{
        req.user.following.addToSet(req.params.UserId)
        followUser.followers.addToSet(req.user.id)
      }
      await req.user.save();
      await followUser.save();
      res.json({
        user: req.user, followUser
      })
    
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
