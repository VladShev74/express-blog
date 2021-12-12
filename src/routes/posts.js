const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares');
const { Tags, Posts } = require("../models");


// respond with "hello world" when a GET request is made to the homepage
router.get('/', async (req, res, next) => {
  try{
    const posts = await Posts.find();

    return res.json({
      status: 'success',
      code: 200,
      data: {
        posts,
      }
    })
  } catch(error){
    next(error)

  }
})

router.get('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try{
    const post = await Posts.findById(postId);

    return res.json({
      status: 'success',
      code: 200,
      data: {
        post,
      }
    })
  } catch(error){
    next(error)
  }
})

router.post('/', auth,  async (req, res, next) => {
  try {
    const tags_array = req.body.tags.split(', ');// tyt
    const existing_tags = await Tags.find({
      name: {$in: tags_array},
    })
    const filtered_tags = tags_array.filter((el) => {
      return !existing_tags.find((tag) => {
        return tag.name === el
      })
    })
    const new_tags = await Tags.insertMany(filtered_tags.map((el) => {
      return {name: el}
    }))

    const new_post = await Posts.create({...req.body, tags: [...existing_tags, ...new_tags], author: req.user.id});
    
    req.user.posts.push(new_post);

    await new_post.populate("tags")
    await req.user.save()
    return res.json({
      status: 'success',
      code: 200,
      data: {
        new_post,
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
})

router.put('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try{
    const updated_post = await Posts.findByIdAndUpdate(postId, req.body, {
      new: true
    });
    
    
    return res.json({
      status: 'success',
      code: 200,
      data: {
        updated_post,
      }
    })

  }catch(error){
    res.status(500).send({message: 'error'})
    console.log(error)
  }
})

router.delete('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try{
    const post = await Posts.findByIdAndDelete(postId)
    return res.json({
      status: 'post deleted',
      code: 200,
      data: {
        post,
      }
    })
  } catch(error){
    res.status(500).send({message: 'error'})
    console.log(error)
  }
})

router.patch('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try{
    const post = await Posts.findById(postId);

    post.usersLiked++;

    await post.save();
    return res.json({
      status: 'success',
      code: 200,
      data: {
        post,
      }
    })

  
  } catch(error){
    res.status(500).send({message: 'error'})
    console.log(error)
  }

})

router.patch('/:postId/save', async (req, res, next) => {
  const { postId } = req.params;
  try{
    // add to user array
    const post = await Posts.findById(postId);

    post.usersReading++;

    await post.save();

    return res.json({
      status: 'success',
      code: 200,
      data: {
        post,
      }
    })

  
  } catch(error){
    res.status(500).send({message: 'error'})
    console.log(error)
  }

})

module.exports = router