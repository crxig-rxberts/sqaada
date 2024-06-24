const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/key').mongoURI;
const app = express(morgan('tiny'));
const home = require('./routes/home');

app.use('/', home)

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect to the remote database
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log('connected to the database..'))
    .catch(err => console.log(err))
const port = process.env.PORT || 8000 ;
app.listen(port, ()=>{
    console.log(`server started at port ${port}`);
})