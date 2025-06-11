// Create chat table when user start texting
const express = require('express');
const { supabase } = require('../../config/supabase');
const router = express.Router();

async function createChat(user1_id,user2_id){
    const {data,error} =await supabase
    .from('chats')
    .insert([{user1_id,user2_id}])
    .select()
    .single();

    if(error) throw error;
    return data;
}