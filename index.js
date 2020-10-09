const express = require('express');
const app = express();
const usersRoute = require('./routes/users')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('docs/swagger.yaml')

//Copy env variables from .env file to process.env
require('dotenv').config()

//Run middlewares
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//Attache routes
app.use('/users', usersRoute)

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, ()=> {
    console.log('Nani');
})

app.listen(process.env.PORT, ()=> {
    console.log('listening on http://localhost:'+process.env.PORT);
})