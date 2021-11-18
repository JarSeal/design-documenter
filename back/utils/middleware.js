const jwt = require('jsonwebtoken');
const logger = require('./logger');

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    if(process.env.NODE_ENV !== 'test') {
        logger.error(error.message);
    }

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message, errors: error.errors });
    }

    next(error);
};

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    request.token = null;
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    }
    if(request.token) {
        try {
            request.decodedToken = jwt.verify(request.token, process.env.SECRET);
        } catch(e) {
            return response.status(401).send({ error: 'invalid token' });
        }
    }
    next();
};

const cookieCheck = (req, res, next) => {
    // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    // res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // console.log('HERE', req.cookies.keksi);
    // if(!req.cookies.keksi) {
    //     res.cookie('keksi', '109', { expires: new Date(Date.now() + 60) });
    // } else {
    //     console.log(req.cookies);
    // }
    next();
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    cookieCheck,
};