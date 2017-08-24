const Joi = require('Joi');

module.exports = {
    validateParam: (schema, name) => {
        return (req, res, next) => {
            console.log('req.params', req.params);
            const result = Joi.validate({ param: req['params'][name]}, schema);
            if(result.error) {
                // Error happend
                return res.status(400).json(result.error.name);
            } else {
                if(!req.value)
                    req.value = {};

                if(!req.value['params'])
                    req.value['params'] = {};

                req.value['params'][name] = result.value.param;
                next();
            }
        }
    },
/*
    req['params'][name] => req.params.userId
    name = 'userId'
*/

    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if(result.error) {
                return res.status(400).json(result);
            } else {
                if (!req.value)
                    req.value = {};

                if(!req.value['body'])
                    req.value['body'] = {};

                req.value['body'] = result.value;
                next();
            }
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
            username: Joi.string().required(),            
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),

        signinSchema: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        }),
        
        userSchema: Joi.object().keys({
            username: Joi.string().required(),
            email: Joi.string().email().required()
        }),

        userOptionalSchema: Joi.object().keys({
            username: Joi.string(),
            email: Joi.string().email()
        }),

        userModuleSchema: Joi.object().keys({
            name: Joi.string().required(),
            surface_area: Joi.string().required(),
            position: Joi.string().required(),
            category: Joi.string().required(),
            header: Joi.any(),
            config: Joi.any(),
            visible: Joi.default(),
            default: Joi.default()
        }),

        moduleSchema: Joi.object().keys({
            user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            name: Joi.string().required(),
            surface_area: Joi.string().required(),
            position: Joi.string().required(),
            category: Joi.string().required(),
            header: Joi.any(),
            config: Joi.any(),
            visible: Joi.default(),
            default: Joi.default()
        }),

        putModuleSchema: Joi.object().keys({
            name: Joi.string().required(),
            surface_area: Joi.string().required(),
            position: Joi.string().required(),
            category: Joi.string().required(),            
            header: Joi.any(),
            config: Joi.any(),
            visible: Joi.default(),
            default: Joi.default()
        }),

        patchModuleSchema: Joi.object().keys({
            name: Joi.string(),
            surface_area: Joi.string(),
            position: Joi.string(),
            category: Joi.string(),            
            header: Joi.any(),
            config: Joi.any(),
            visible: Joi.default(),
            default: Joi.default()
        }),

        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }),

        usernameSchema: Joi.object().keys({
            param: Joi.string().required()
        })

    }
}
