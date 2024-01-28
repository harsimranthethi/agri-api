var express = require( "express");
var config = require("./config.js")
var cors = require('cors')

const app  = express();

app.use(cors())
app.use(express.json());

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use("/sf", require("./routes/pages/sensorfeed.js"))

app.listen(config.PORT, () => {
    console.log('App is listening to port: ' + config.PORT); 
});




