const express = require('express');
const { supabase } = require('../../config/supabase');
const router = express.Router();

async function getAllPosts(){
    const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false});

    if(error) throw error;
    return data;
}

async function getOwnPost(userId){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', {acending : false});

    if(error) throw error;
    return data;
}

async function createPost(user_id,course_id,course_exchange_id,context,tag){
    const {data, error}= await supabase
    .from('posts')
    .insert([{user_id,course_id,course_exchange_id,context,tag}])
    .select()
    .single();

    if(error) throw error;
    return data;
}

module.exports ={createPost, getAllPosts, getOwnPost};