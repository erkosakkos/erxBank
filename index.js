const express = require('express');
const app = express();
const usersRoute = require('./routes/users')
const sessionsRoute = require('./routes/sessions')
const transactionsRoute = require('./routes/transactions')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocument = yaml.load('docs/swagger.yaml')
const {processTransactions} = require('./middlewares')

//Copy env variables from .env file to process.env
require('dotenv').config()

//Run middlewares
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//Attache routes
app.use('/users', usersRoute)
app.use('/sessions', sessionsRoute)
app.use('/transactions', transactionsRoute)
app.use('/jwks', function(req, res) {
    res.redirect('https://dev.erxit.eu/transactions/jwks')})

mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, ()=> {
    console.log('Nani???');
})

processTransactions()

app.listen(process.env.PORT, ()=> {
    console.log('listening on http://localhost:'+process.env.PORT);
})