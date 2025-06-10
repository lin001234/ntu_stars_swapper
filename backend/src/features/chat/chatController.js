// Create chat table when user start texting
const express = require('express');
const { supabase } = require('../../config/supabase');
const router = express.Router();