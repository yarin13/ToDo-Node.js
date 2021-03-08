const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    isPrivate: {
       type: Boolean,
       default: false
    }
});

module.exports = mongoose.model('Task',TaskSchema);