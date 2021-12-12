const express = require('express')
const postsModel = require("../models/postsSchema");
const router = express.Router()

// respond with "hello world" when a GET request is made to the homepage
router.get('/', async (req, res, next) => {
  try{
    const posts = await postsModel.find();

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
    const post = await postsModel.findById(postId);

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

router.post('/', async (req, res, next) => {
  try {
    const new_post = await postsModel.create(req.body);

    await new_post.save();
    return res.json({
      status: 'success',
      code: 200,
      data: {
        new_post,
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.put('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  try{
    const updated_post = await postsModel.findByIdAndUpdate(postId, req.body, {
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
    const post = await postsModel.findByIdAndDelete(postId)
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
    const post = await postsModel.findById(postId);

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
    const post = await postsModel.findById(postId);

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