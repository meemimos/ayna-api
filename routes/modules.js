const router = require('express-promise-router')();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const ModuleController = require('../controllers/modules');

const {
    validateBody,
    validateParam,
    schemas
} = require('../helpers/routeHelpers');

router.route('/')
    .get(ModuleController.index)
    .post(passport.authenticate('jwt', {session: false}),
        validateBody(schemas.moduleSchema),
        ModuleController.newModule);

router.route('/:moduleId')
    .get(validateParam(schemas.idSchema, 'moduleId'),
        ModuleController.getModule)
    .put([validateParam(schemas.idSchema, 'moduleId'),
        validateBody(schemas.putModuleSchema)],
        passport.authenticate('jwt', {session: false}),
        ModuleController.replaceModule)
    .patch([validateParam(schemas.idSchema, 'moduleId'),
        validateBody(schemas.patchModuleSchema)],
        // passport.authenticate('jwt', {session: false}),
        ModuleController.updateModule)
    .delete(validateParam(schemas.idSchema, 'moduleId'),
        passport.authenticate('jwt', {session: false}),
        ModuleController.deleteModule);

module.exports = router;
