const express = require('express');
const posts = require('./posts');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
// Route to get all posts
router.get('/get', async(req,res)=>{
    try{
        const allposts = await posts.getAllPosts();
        res.json({success:true,allposts});
    } catch(err){
        console.error('Failed to fetch all posts:', err.message);
        res.status(500).json({success:false, error:'Failed to get all posts'});
    }
})

//Route to get current user post
router.get('/self', requireAuth, async(req,res) =>{
    try{
        const userId = req.user.id;
        const self_posts = await posts.getOwnPost(userId);
        res.json({success:true, self_posts});
    } catch(err){
        console.error('Failed to fetch user posts:', err.message);
        res.status(500).json({success:false, error: 'Failed to get posts'});
    }
})

//Route to create new post
router.post('/', requireAuth, async(req,res) =>{
    try{
        const userId=req.user.id;
        const {course_id,course_exchange_id,context,tag} = req.body;
        
        if (!course_id || !course_exchange_id || !context || !tag){
            return res.status(400).json({
                success: false,
                error: 'Insufficient details'
            });
        }

        const newPost= await posts.createPost(userId,course_id,course_exchange_id,context,tag);
        res.status(201).json({success: true, post:newPost});
    }catch(err){
        console.error('Error creating post:', err.message);
        res.status(500).json({success:false,error:'Failed to create post'});
    }
})
// test route for creating a post without authentication
router.post('/test', async(req,res) =>{
    try{
        const {userId,course_id,course_exchange_id,context,tag} = req.body;
        
        if (!course_id || !course_exchange_id || !context || !tag){
            return res.status(400).json({
                success: false,
                error: 'Insufficient details'
            });
        }

        const newPost= await posts.createPost(userId,course_id,course_exchange_id,context,tag);
        res.status(201).json({success: true, post:newPost});
    }catch(err){
        console.error('Error creating post:', err.message);
        res.status(500).json({success:false,error:'Failed to create post'});
    }
})

module.exports=router;