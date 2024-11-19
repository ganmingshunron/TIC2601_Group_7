const express = require('express');
const cors = require('cors')
const app = express();

const port = 3001;

const dataInit = require('./dataInit');

app.use(cors())
app.use(express.json())

const home = require('./scripts/home');
app.use('/home', home);

app.listen(port, function(){
    console.log(`Express app listening on port ${port}!`);
});