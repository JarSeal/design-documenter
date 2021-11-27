const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const formsRouter = require('./controllers/forms');
const universesRouter = require('./controllers/universes');
const healthRouter = require('./controllers/health');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const createPresetForms = require('./controllers/forms/createPresetForms');
const { createRandomString } = require('../shared/parsers');

process.env.TZ = 'Europe/London';

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        logger.info('connected to MongoDB');
        createPresetForms();
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message);
    });

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: 3600000, // 1000 = 1 second
        secure: false,
        sameSite: 'lax',
    },
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
    rolling: true,
}));
app.use(cors({
    origin: [
        'http://localhost:8080',
        'https://localhost:8080',
        'http://localhost:3001',
        'https://localhost:3001',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}));
app.use('/', express.static('build'));
app.use('/teest', express.static('build/teest'));
app.use(express.json());
app.use(middleware.requestLogger);

if(process.env.SERVE_STATIC === 'production') {
    app.use(express.static('front'));
}

app.use((req, res, next) => {
    const c = csrf({ cookie: false });
    c(req, res, ()=>{validateToken(req, res, next, c);});
});
const validateToken = (req, res, next, c) => {
    if(req.path === '/api/login/access') {
        const timestamp = (+ new Date());
        req.session.csrfSecret = timestamp + '-' + createRandomString(24);
        const token = req.csrfToken();
        req.body['_csrf'] = token;
    }
    
    // Check if token has expired
    const maxTime = 10000; // milliseconds (1000 = 1 second)
    const tokenTime = req.session.csrfSecret.split('-')[0];
    if(parseInt(tokenTime) + maxTime < (+ new Date())) {
        // Expired
        req.body['_csrf'] = 'expired';
    }
    c(req, res, next);
};

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/forms', formsRouter);
app.use('/api/universes', universesRouter);
app.use('/api/health', healthRouter);

if(process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing');
    app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;