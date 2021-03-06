const router = require('express').Router();
const userModel = require('../models/User')
const sessionModel = require('../models/Session')
const bcrypt = require('bcrypt')
const {verifyToken} = require('../middlewares')

router.post('/', async (req, res, next) => {

    //Get user by username from db
    const user = await userModel.findOne({username: req.body.username})
    //Validate username and password
    const passwordCheck = await bcrypt.compare(req.body.password, user.password)
    if(!user || !passwordCheck ){
        return res.status(401).json({error: 'Invalid username/password'})
    }
    //Create session to db
    const session = await sessionModel.create({
        userId: user.id
    })
    //Return token to user
    return res.status(200).json({token: session.id})
})

router.delete('/', verifyToken, async (req, res, next) => {
    try{
    //Get session by userId from db
    const session = await sessionModel.findOne({userId: req.userId})

    //Check that session existed in db
    if(!session){
        return res.status(404).json({error: 'Invalid session'})
    }
    //Delete session from db
    await sessionModel.deleteOne({_id: session._id.toString()})
    //Return token to user
    return res.status(204).json()
    } catch (e) {
        return res.status(400).json({error: e.message})
    }    
})
module.exports = router;