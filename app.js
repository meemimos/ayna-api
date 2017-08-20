const express = require('express'),
      cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const jsdom = require("jsdom");
const $ = require('jquery');
const http = require('http');
const passport = require('passport');
const config = require('./config/database');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err);
});

// Initializing our app at express
const app = express();
app.use(helmet());

// Routes_variable
const modules = require('./routes/modules');
const users = require('./routes/users');

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Routes
app.use(express.static('public'));

app.use('/modules', cors(), modules);
app.use('/users', cors(), users);

// app.use(require('./src/app/routes/index.js'));


// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found!');
    err.status = 404;
    next(err);
});

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    // Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });

    //Respond to ourselves
    console.error(err);
});

// Read Directory
var files = fs.readdir("./", (err, files) => {
    if(err)
        console.log(err);

    console.log("files: " + files.join(" | "));
})



// Start the server
const port = app.get('port') || 8000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
