const Module = require('../models/module');
const User = require('../models/user');

module.exports = {

    index: async (req, res, next) => {
        // Get all the modules
        var sortByName = {name: 1};
        const modules = await Module.find({"default": "true"}).sort(sortByName);
        res.status(200).json(modules);
    },

    newModule: async (req, res, next) => {

        const foundModuleByName = await Module.findOne({ name });
        console.log(foundModuleByName);
        if(foundModuleByName) {
            return res.status(403).json({error: 'This module is already in your module list.'})
        }

        // 1. Find the actual user
        const user = await User.findById(req.body.user);

        // 2. Create a new Module
        const newModule = req.body;
        delete newModule.user;

        const module = new Module(newModule);
        module.user = user;
        await module.save();

        // 3. Add newly created module to the actual user
        user.modules.push(module);
        await user.save();

        // We're done!
        res.status(200).json(module);
    },

    getModule: async (req, res, next) => {
        const module = await Module.findById(req.value.params.moduleId);
        res.status(200).json(module);
        // console.log(module.name);
    },

    replaceModule: async (req, res, next) => {
        const { moduleId } = req.value.params;
        const newModule = req.value.body;
        const result = await Module.findByIdAndUpdate(moduleId, newModule);
        res.status(200).json({ success: true });
    },

    updateModule: async (req, res, next) => {
        const { moduleId } = req.value.params;
        const newModule = req.value.body;
        const result = await Module.findByIdAndUpdate(moduleId, newModule);
        res.status(200).json({ success: true });
    },

    deleteModule: async (req, res, next) => {
        const { moduleId } = req.value.params;

        // Get a Module
        const module = await Module.findById(moduleId);
        if(!module) {
            return res.status(404).json({ error: "Module does not exist!"});
        }
        const userId = module.user;

        // Get a User
        const user = await User.findById(userId);

        // Remove Module
        await module.remove();
        // Remove module from the user's module list
        user.modules.pull(module);
        await user.save();

        res.status(200).json({ success: true });

    }
}
