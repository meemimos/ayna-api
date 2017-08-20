const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');


// const router = express.Router(); <- we dont use this one
// we use express-promise-router instead of express.Router() because 
// try catch block part will be done automatically by this package

const router = require('express-promise-router')();

const UserController = require('../controllers/users');

const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers');

router.route('/signup')
    .post(validateBody(schemas.authSchema), UserController.signUp);

router.route('/signin')
    .post(validateBody(schemas.signinSchema), UserController.authenticate);

router.route('/')
    .get(UserController.index);

router.route('/:userId')
    .get(validateParam(schemas.idSchema, 'userId'), UserController.getUser)

    .put([validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.idSchema)],
        passport.authenticate('jwt', {session: false}),
        UserController.replaceUser)

    .patch([validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userOptionalSchema)],
        passport.authenticate('jwt', {session: false}),        
        UserController.updateUser)

    .delete(validateParam(schemas.idSchema, 'userId'),
        passport.authenticate('jwt', {session: false}),     
        UserController.deleteUser);

router.route('/:userId/modules')
    .get(validateParam(schemas.idSchema, 'userId'),
        UserController.getUserModules)
    .post([validateParam(schemas.idSchema, 'userId'),
        validateBody(schemas.userModuleSchema)],
        passport.authenticate('jwt', {session: false}),        
        UserController.newUserModule);

module.exports = router;
