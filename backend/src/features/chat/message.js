// Create/send messages
const express = require('express');
const { supabase } = require('../../config/supabase');
const router = express.Router();

async function getChatMessage(chat_id){
    const {data,error} = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id',chat_id)
    .order('created_at', {ascending:true});

    if(error) throw error;
    return data;
}

async function createChatMessage(chat_id,sender_id,content,sender_username){
    const {data,error} = await supabase
    .from('messages')
    .insert([{chat_id,sender_id,content,sender_username}])
    .select()
    .single();

    if(error) throw error;
    return data;
}

async function deleteChatMessage(id,sender_id){
    const {data,error} = await supabase
    .from('messages')
    .delete()
    .eq('id', id)
    .eq('sender_id', sender_id)

    if(error) throw error;
    return data;
}

module.exports={
    getChatMessage,
    createChatMessage,
    deleteChatMessage,
};