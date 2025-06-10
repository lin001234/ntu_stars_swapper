// Create/send messages
const express = require('express');
const { supabase } = require('../../config/supabase');
const router = express.Router();

async function getChatMessage(chat_id){
    const {data,error} = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id',chat_id)
    .order('created_at', {ascending:false});

    if(error) throw error;
    return data;
}