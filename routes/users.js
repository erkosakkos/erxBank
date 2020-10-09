const router = require('express').Router();
const User = require('../models/User')
const Account = require('../models/Account')
const bcrypt = require('bcrypt')

router.post('/', async (reg, res, next) => {

        //Make sure the password is supplied
        if(typeof reg.body.password === "undefined" || reg.body.password.length < 8) {
            res.status(400).send({error: "Invalid password"})

            return
        }

        //Hash the password
        reg.body.password = await bcrypt.hash(reg.body.password, 10);


            try {

                //Create new user to DB
                const user = await new User(reg.body).save()


                //Create new account for the user
                const account = await new Account({userId: user.id}).save()

                //Return user to client
                res.status(201).send({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    accounts: [account]
                })
            } catch (e) {

                //Catch duplicate username attempts
                if (/E11000.*username.* dup key.*/.test(e.message)) {
                    res.status(409).send({error: 'Username already exists'})

                    //Stop the execution
                    return
                }

                //Handle other errors
                res.status(400).send({error:e.message})

        }
})

module.exports = router;