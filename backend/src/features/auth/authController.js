exports.handleOauthCallback = (req, res) =>{
    req.session.user = req.user;

    req.session.save(err => {
        if (err){
            console.error('Session save error:', err);
            return res.status(500).send('Session save failed');
        }
        res.redirect( `${process.env.CLIENT_URL}/auth/success` || 'http://localhost:5173/auth/success');
    });
};

exports.logout = (req,res)=>{
    req.logout((err) => {
        if(err){
            return res.status(500).json({ error : 'Logout failed'});
        }
        res.json({message: 'Logged out successfully'});
        res.redirect( `${process.env.CLIENT_URL}/login` || 'http://localhost:5173/login');
    });
};

exports.status = (req,res)=>{
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user});
    }
    else{
        res.json({authenticated:false});
    }
}