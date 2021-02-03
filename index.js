const express = require('express');
const app = express();
const path = require('path');
const bestShipmentRouter = require('./routes/bestShipment');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));

app.use('/', bestShipmentRouter);

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(3000, function() {
    console.log('Listening on port 3000!')
});