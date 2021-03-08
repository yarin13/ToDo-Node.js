const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const tasks = require('../controllers/tasks');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor} = require('../middleware');

router.get('/',catchAsync(tasks.index));

router.get('/tasks/new', isLoggedIn, tasks.renderNewForm);

router.post('/tasks', isLoggedIn, catchAsync(tasks.createTask));

router.get('/tasks/:id/edit', isLoggedIn, isAuthor, tasks.renderEditForm);

router.put('/tasks/:id', isLoggedIn, isAuthor, catchAsync(tasks.updateTask));

router.delete('/tasks/:id', isLoggedIn, isAuthor, catchAsync(tasks.deleteTask));


module.exports = router;