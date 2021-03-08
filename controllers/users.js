const User = require('../models/user');
const bcrypt = require('bcrypt');


module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
};

module.exports.login = async (req,res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    if(validPassword){
        req.session.user_id = user._id;
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        return res.redirect(redirectUrl);
    }

    return res.redirect('/');
};

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
};

module.exports.register = async (req,res)=>{
    const {username, email, password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        email,
        password: hash
    });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');

};


module.exports.logout = (req,res)=>{
    req.session.user_id = null;
    res.redirect('/');
}