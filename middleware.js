const Task = require('./models/task');


module.exports.isLoggedIn = (req,res ,next) => {
    if(!req.session.user_id){
        req.session.returnTo = req.originalUrl; 
        return res.redirect('/user/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next)=>{
    const {id} = req.params;
    const task = await Task.findById(id);
    if(!task.owner.equals(req.session.user_id)){
        return res.redirect(`/`);
    }
    next();
}