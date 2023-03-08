const express = require('express');
const app = express();
const http = require('http').createServer(app)

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/public', express.static(process.cwd() + '/public'));

app.route('/').get((req, res) => {
    res.render('home')
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})