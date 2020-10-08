require('dotenv-safe').config(); 

const { json, urlencoded } = require('body-parser');
const { createEngine } = require('express-react-views');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors =  require('cors');
 

mongoose.connect('mongodb://localhost/view_store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>{
    console.log("#################");
    console.log("# BD Conectado! ");
    console.log("#################");
}).catch(() => {
    console.error("#####################");
    console.error("# BD Não Conectado! ");
    console.error(`# Erro: ${erro} `);
    console.error("#####################");
});

mongoose.Promise = global.Promise;



let app = express();




app.set('views', __dirname+'/views');
app.set('view engine', 'jsx');
app.engine('jsx', createEngine());

let rotaView = require('./routes/roteView');

app.use(json());
app.use(urlencoded());
app.use(cookieParser(process.env.SECRET));
app.use((req, res, next) =>{
    let data = new Date();
    console.warn();
    console.warn("###################################################################################");
    console.warn(`# Hora da requisição: ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()} - ${data.getDate()}/${data.getMonth()}/${data.getFullYear()}`);
    console.warn(`# (Método) URL: (${req.method}) ${req.url}`);
    console.warn(`# Body: ${Object.values(req.body)}`);
    console.warn(`# Cookies sem segurança: ${Object.values(req.cookies)}`);
    console.warn(`# Cookies com segurança: ${Object.values(req.signedCookies)}`);
    console.warn("###################################################################################");
    console.warn();
    next();
});
app.use(cors({
    origin: `http://localhost:${process.env.PORT}/`,
    credentials: true
}));
app.use('/static', express.static(__dirname+'/public'));
app.use('/view/', rotaView);

