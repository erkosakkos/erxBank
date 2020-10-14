const mongoose = require('mongoose');
const sessionModel = require('./models/Session')

exports.verifyToken = async (req, res, next) => {

    //Check Authorization header is provided
    let authorizationHeader = req.header('Authorization');

    if(!authorizationHeader){
        return res.status(401).json({error: 'Missing Authorization header'})
    }
    //Split Authorization header into an array (by spaces)
    authorizationHeader = authorizationHeader.split(' ')

    //Check Authorization header for token
    if (!authorizationHeader[1]){
        return res.status(400).json({error: 'Invalid Authorization header format'})
    }
    //Validate token is on mongo ObjectId to prevent UnhandledPromiseRejectionWarnings
    if(!mongoose.Types.ObjectId.isValid(authorizationHeader[1])){
        return res.status(401).json({error: 'Invalid token'});
    }
    const session = await sessionModel.findOne({_id: authorizationHeader[1]});
    console.log(session)
    if (!session) return res.status(401).json({error: 'Invalid token'});

    //Write user's id into req
    req.userId = session.userId

    //Pass the request to next middleware
    return next();
}