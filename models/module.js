const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    name: {
        type: String
    },
    surface_area: {
        type: String
    },
    position: {
        type: String
    },
    category: {
        type: String
    },
    header: {
        type: String
    },
    config: {
        type: String
    },
    visible: {
        type: Boolean,
        default: true
    },
    default: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Module = mongoose.model('module', moduleSchema);

module.exports = Module;
