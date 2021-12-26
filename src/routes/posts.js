const express = require("express");
const router = express.Router();
const { schemaValidate } = require("../middlewares");
const { postsValidator } = require("../validationSchemas");

const { auth } = require("../middlewares");
const { Tags, Posts } = require("../models");

// respond with "hello world" when a GET request is made to the homepage
const createTags = async (tagsString) => {
  let new_tags = [];
  let existing_tags = [];
  if (tagsString) {
    const tags_array = tagsString.split(", ");
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
    return [...existing_tags, ...new_tags];
  } else {
    return [];
  }
};
router.get("/", async (req, res, next) => {
  try {
    const posts = await Posts.find().populate("tags").populate("author");

    return res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId)
      .populate("tags")
      .populate("author")
      .populate({ path: "comments", populate: { path: "author" } });

    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post(
  "/",
  schemaValidate(postsValidator.postCreate),
  auth,
  async (req, res, next) => {
    try {
      const tags = await createTags(req.body.tags);

      const new_post = await Posts.create({
        ...req.body,
        tags,
        author: req.user.id,
      });

      req.user.posts.push(new_post);

      await new_post.populate("tags");
      await req.user.save();
      return res.json(new_post);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.put(
  "/:postId",
  schemaValidate(postsValidator.postUpdate),
  auth,
  async (req, res, next) => {
    const { postId } = req.params;
    try {
      // const post = await Posts.findById(postId);
      if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({
          message: "bad author",
        });
      }
      const tags = await createTags(req.body.tags);
      const updated_post = await Posts.findByIdAndUpdate(postId, {...req.body, tags}, {
        new: true,
      });

      return res.json(updated_post);
    } catch (error) {
      res.status(500).send({ message: "error" });
      console.log(error);
    }
  }
);

router.delete("/:postId", auth, async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId);
    if (!post.author.equals(req.user._id)) {
      return res.status(403).json({
        message: "bad author",
      });
    }

    const post_toDel = await Posts.findByIdAndDelete(postId);
    req.user.posts.pull(req.params._id);
    await req.user.save();
    return res.json(post_toDel);
  } catch (error) {
    res.status(500).send({ message: "error" });
    console.log(error);
  }
});

router.patch("/:postId/like", auth, async (req, res, next) => {
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
    res.status(500).send({ message: "error" });
    console.log(error);
  }
});

router.patch("/:postId/save", auth, async (req, res, next) => {
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
    res.status(500).send({ message: "error" });
    console.log(error);
  }
});

module.exports = router;
