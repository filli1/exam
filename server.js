const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

var server = app.listen(port, function(error){
    if (error) throw error;
    console.log("Express server listening on port, ", port)
});

//Require Routes
const users = require('./routes/users.routes');
app.use('/users', users);