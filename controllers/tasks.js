const Task = require('../models/task');

module.exports.index = async(req,res)=>{
    const tasks = await Task.find().populate('owner');
    res.render('tasks/home',{tasks});
};

module.exports.renderNewForm = (req,res)=>{
    res.render('tasks/new');
};

module.exports.createTask = async (req,res)=>{
    const body = req.body;
    if(body.isPrivate)
        body.isPrivate = true;
    // else
    //     body.isPrivate = false;
    const task = new Task(body);
    task.owner = req.session.user_id;
    await task.save();
    res.redirect('/');
};

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const task = await Task.findById(id).populate('owner');
    res.render('tasks/edit',{task});
};

module.exports.updateTask = async(req,res)=>{
    const body = req.body;
    const { id } = req.params;
    if(body.isPrivate)
        body.isPrivate = true;
    else
        body.isPrivate = false;
    const task = await Task.findByIdAndUpdate(id,body);
    res.redirect('/');
};

module.exports.deleteTask =  async (req,res)=>{
    const {id} = req.params;
    await Task.findByIdAndDelete(id);
    console.log("after delete");
    res.send();
};

