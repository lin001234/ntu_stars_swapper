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
async function getPostbById(id){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

    if (error) throw error;
    return data;
}
async function createPost(user_id,course_id,context,tag,index_id,index_exchange_id,username){
    const {data, error}= await supabase
    .from('posts')
    .insert([{user_id,course_id,context,tag,index_id,index_exchange_id,username}])
    .select()
    .single();

    if(error) throw error;
    return data;
}

async function deletePost(id){
    const {data,error}= await supabase
    .from('posts')
    .delete()
    .eq('id', id);
        
    if(error) throw error;
    return data;
}

async function filter_byTag(tag){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .eq('tag',tag);

    if (error) throw error;
    return data;
}

async function filter_byMod(course_id){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .eq('course_id',course_id);

    if (error) throw error;
    return data;
}

// reasoning is if i want find course_id, it would be in others exchange_id
async function filter_byIndexid(course_id, index_id){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .match({course_id: course_id, index_exchange_id: index_id})

    if (error) throw error;
    return data;
}

async function filter_byIndex_exchange_id(course_id, index_exchange_id){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .match({course_id: course_id, index_id: index_exchange_id})

    if (error) throw error;
    return data;
}

async function filter_by_all(course_id, index_id, index_exchange_id){
    const {data,error} = await supabase
    .from('posts')
    .select('*')
    .match({course_id: course_id, index_id: index_exchange_id, index_exchange_id:index_id})

    if (error) throw error;
    return data;
}

module.exports = {
  getAllPosts,
  getOwnPost,
  getPostbById,
  createPost,
  deletePost,
  filter_byTag,
  filter_byMod,
  filter_byIndexid,
  filter_byIndex_exchange_id,
  filter_by_all
};