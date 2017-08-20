const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Create a Schema
const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'module'
    }]
});

// Create a Model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch(error) {
        throw new Error('Hashing failed', error);
    } 
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
}


module.exports.comparePasswords = async (inputPassword, hashedPassword, callback) => {
        await bcrypt.compare(inputPassword, hashedPassword, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}
