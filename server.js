const express = require('express')
const bodyParser = require('body-parser');
const api = require('./controllerAPI/api-controller');
const path = require('path')
const app = express();
const port = 3000
app.use(bodyParser.json()); // 解析JSON数据
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')))
app.use('/',api)


app.listen(port,() => {
    console.log('http://127.0.0.1:3000/chile/index.html')
})