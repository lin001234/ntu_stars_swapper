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
        //Clear session cookie
        res.clearCookie('connect.sid',{
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none':'lax',
            httpOnly : true,
            path:'/',
        });

        req.session.destroy((err) =>{
            if(err){
                console.error('Session destruction error:', err);
                return;
            }
            return res.status(200).json({ message: 'Logged out successfully' });
        });
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