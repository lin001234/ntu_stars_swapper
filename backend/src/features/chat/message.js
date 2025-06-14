// Create/send messages
const express = require('express');
const { supabase } = require('../../config/supabase');
const router = express.Router();

async function getChatMessage(chat_id){
    const {data,error} = await supabase
    .from('messages_with_usernames')
    .select('*')
    .eq('chat_id',chat_id)
    .order('created_at', {ascending:true});

    if(error) throw error;
    return data;
}

async function createChatMessage(chat_id,sender_id,content){
    const {data:insertedMessage,error} = await supabase
    .from('messages')
    .insert([{chat_id,sender_id,content}])
    .select()
    .single();

    if(error) throw error;
    // Optional: Wait for Supabase to update the view/join
    await new Promise((resolve) => setTimeout(resolve, 300)); // 300–500ms

    // Re-fetch the enriched message (from a view or joined query)
    const { data: enrichedMessage, error: fetchError } = await supabase
        .from('messages_with_usernames')
        .select('*')
        .eq('id', insertedMessage.id)
        .single();

    if (fetchError) throw fetchError;

    return enrichedMessage;
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