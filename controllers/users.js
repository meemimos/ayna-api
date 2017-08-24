const User = require('../models/user');
const Module = require('../models/module');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/database');

module.exports = {

    signUp: async (req, res, next) => {
        
        var { username, email, password } = req.value.body;

        // Check if there is a user with same email and same username
        const foundUserByEmail = await User.findOne({ email });
        const foundUserByUsername = await User.findOne({ username });
        
        if(foundUserByUsername) {
            return res.status(403).json({error: 'Username is already in use.'});
        }else if(foundUserByEmail) {
            return res.status(403).json({error: 'Email is already in use.'});
        }

        // Hash the password
        const hash = await User.hashPassword(password);
        password = hash;
        
        // Create a new user
        const newUser = new User({ username, email, password });
        const user = await newUser.save();

        res.status(201).json(user);
    },

    authenticate: async (req, res, next) => {
        var { username, password } = req.value.body;
        console.log("error");
        
        // Check if there is a user with username
        User.getUserByUsername(username, (err, user) => {
            if(err) throw err;
            if(!user) {
                return res.json({success: false, msg: 'User not found!'});
            } 
            User.comparePasswords(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 604800 // 1 week
                    });

                    res.json({
                        success: true,
                        token: 'JWT ' +token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        }
                    });
                } else {
                    return res.json({success: false, msg: 'Wrong Password'});
                }
            });
        });
    },

    secret: async (req, res, next) => {
        console.log("userController.secret");
    },

    // Using async/await
    //Validation: DONE

    index: async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json(users);    
    },

    // Validation : DONE
    getUser: async (req, res, next) => {
        const { userId } = req.value.params;
        const user = await User.findById(userId);
        res.status(200).json(user);
    },

    // Validation : DONE
    replaceUser: async (req, res, next) => {
        // enforce that req.body must contain all the fields
        const { userId } = req.value.params;
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({ success: true });
    },

    // Validation : DONE
    updateUser: async (req, res, next) => {
        // enforce that req.body may contain any number of fields
        const { userId } = req.value.params;
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json({ success: true });
    },

    // Validation : DONE
    getUserModules: async (req, res, next) => {
        const { userId } = req.value.params;
        const user = await User.findById(userId).populate(`modules`);
        // console.log(`user`, user);sssss
        res.status(200).json(user.modules);
    },

    // Validation : DONE
    newUserModule: async (req, res, next) => {
        const { userId } = req.value.params;
        // Create a new module
        const newModule = new Module(req.value.body);
        // Get user
        const user = await User.findById(userId);
        // Assign user as a module's user
        newModule.user = user;
        // Save the module
        await newModule.save();
        // Add module to the user's user array 'modules'
        user.modules.push(newModule);
        // Save the user
        await user.save();
        res.status(201).json(newModule);
    },

    deleteUser: async (req, res, next) => {
        const { userId } = req.value.params;

        // Get a User
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ error: "User does not exist!"});
        }
        console.log(user);
        // Remove User
        await user.remove();
        await user.save();

        res.status(200).json({ success: true });

    }

};

    /*

    we can interact with mongoose in 3 different ways
    1. callbacks
    2. promises
    3. Async/Await (Promises)

    */
