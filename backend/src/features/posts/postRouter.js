const express = require('express');
const posts = require('./posts');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');
// Route to get all posts
router.get('/', async(req,res)=>{
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

//Router to get specific post
router.get('/:id', async(req,res) =>{
    try{
        const {id} = req.params;
        const id_post = await posts.getPostbById(id);
        res.json({success:true, id_post});
    }catch (err){
        console.error('Failed to fetch id post:',err.message);
        res.status(500).json({success:false, error:'Failed to get post'});
    }
})

//Route to create new post
router.post('/', requireAuth, async(req,res) =>{
    try{
        const userId=req.user.id;
        const username=req.user_metadata.name;
        const {course_id,context,tag,index_id,index_exchange_id} = req.body;
        
        if (!course_id || !context || !tag || !index_id || !index_exchange_id){
            return res.status(400).json({
                success: false,
                error: 'Insufficient details'
            });
        }

        const newPost= await posts.createPost(userId,course_id,context,tag,index_id,index_exchange_id,username);
        res.status(201).json({success: true, post:newPost});
    }catch(err){
        console.error('Error creating post:', err.message);
        res.status(500).json({success:false,error:'Failed to create post'});
    }
})

//delete post
router.delete('/:id', async(req,res) => {
    try {
        const {id} = req.params;

        const existingPost = await posts.getPostbById(id);
        if (!existingPost){
            return res.status(404).json({success:false, error: 'Post not found'});
        }
        
        await posts.deletePost(id);
        res.json({success: true, message: `Post with ID ${id} deleted successfully`});
    } catch (err){
        console.error('Error deleting post:', err.message);
        res.status(500).json({success:false,error:'Failed to delete post'});
    }
})


// test route for creating a post without authentication
router.post('/test', async(req,res) =>{
    try{
        const userId=req.user.id;
        const {course_id,context,tag,index_id,index_exchange_id} = req.body;
        
        if (!course_id || !context || !tag || !index_id || !index_exchange_id){
            return res.status(400).json({
                success: false,
                error: 'Insufficient details'
            });
        }

        const newPost= await posts.createPost(userId,course_id,context,tag,index_id,index_exchange_id);
        res.status(201).json({success: true, post:newPost});
    }catch(err){
        console.error('Error creating post:', err.message);
        res.status(500).json({success:false,error:'Failed to create post'});
    }
})


module.exports=router;