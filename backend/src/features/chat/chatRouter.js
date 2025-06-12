const express = require('express');
const chatController = require('./chatController');
const message = require('./message');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');

// Route to get or create chat
router.post('/get-or-create', requireAuth, async(req,res) =>{
    try{
        const user1_id = req.user.id;
        const {user_id:user2_id} = req.body;

        // try and get existing chat
        let chatId;
        try{
            chatId= await chatController.getChatId(user1_id, user2_id);
            console.log('Found existing chat:', chatId); // Debug log
        } catch(err){
            // If chat doesnt exist, create new one
            if(err.message.includes('Chats not found') || err.message.includes('not found')){
                const newChat=await chatController.createChat(user1_id, user2_id);
                console.log('Created new chat:', newChat); // Debug log
                chatId = newChat.id;
            } else{
                throw err;
            }
        }
        res.status(201).json({success:true, chatId:chatId});
        console.log('Sending response:', { success: true, chatId: chatId });
    } catch(err){
        console.error('Failed to create chat:', err.message);
        res.status(500).json({success:false,error:'Failed to create chat:' + err.message});
    }
})

// Get chatId
router.get('/chat-id', requireAuth, async(req,res) =>{
    try{
        const user1_id = req.user.id;
        const {user_id:user2_id} = req.body;
        const chatId = await chatController.getChatId(user1_id,user2_id);
        res.json({success:true,chatId});
    }catch(err){
        console.error("Failed to fetch chatId:", err.message);
        res.status(500).json({success:false,error:'Failed to get chatId'});
    };
})

// Router to get msgs from specific chat
router.get('/:chat_id',async(req,res) =>{
    try{
        const {chat_id} =req.params;
        const messages = await message.getChatMessage(chat_id);
        res.json({success:true,messages});
    } catch(err){
        console.error("Failed to fetch messages:", err.message);
        res.status(500).json({success:false,error:'Failed to get messages'});
    };
})

// create new messages
router.post('/:chat_id',requireAuth, async(req,res) =>{
    try{
        const {chat_id} = req.params;
        const sender_id = req.user.id;
        const {content} = req.body;
        console.log('Sending response', {sender_id : sender_id, chat_id:chat_id});
        if(!content){
            return res.status(400).json({
                success:false,
                error: 'Insufficient details'
            });
        }

        const newMessage= await message.createChatMessage(chat_id,sender_id,content);
        res.status(201).json({success:true, message:newMessage});
    }catch(err){
        console.error('Error creating message:', err.message);
        res.status(500).json({success:false,error:'Failed to create message'});
    }
})

module.exports=router;