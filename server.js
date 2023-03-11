const express = require('express');
const app = express();
const http = require('http').createServer(app);

//FOR DEV ONLY START; DELETE WHEN DONE
const testObj = require('./devTool/product_object.json');

;//FOR DEV ONLY END; DELETE WHEN DONE

app.set('view engine', 'pug');
app.set('views', './views');
app.use('/public', express.static(process.cwd() + '/public'));

app.route('/').get((req, res) => {
    let response = 'hola baby'
    res.render('home',  {response} )
});

app.route('/test').get((req, res) => {
    res.json(testObj)
})

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})  