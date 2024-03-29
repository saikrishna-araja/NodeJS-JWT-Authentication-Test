const express= require('express');
const app = express();

const PORT=3000;
const bodyParser = require('body-parser');
const path = require('path');
const jwt=require('jsonwebtoken');
const { expressjwt: expjwt } = require('express-jwt');


const secretkey ='My Secret Key';

const jwtMW = expjwt({
    secret: secretkey,
    algorithms :['HS256']
});

let users =[
    {
        id: 1,
        username: 'sinchan',
        password: 'doraemon'
    },
    {
        id: 2,
        username: 'fabio',
        password: '456'

    }
]

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:3000/');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended : true}));


app.get('/api/dashboard',jwtMW,(req,res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: 'Welcome to my dashboard.'
    })
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success:true,
        myContent: 'Here are your settings.'
    });
});

app.post('/api/login',(req,res) => {
    const {username, password} = req.body;
    console.log('Username and password',username, password);
    if(users.some(user => user.username === username && user.password === password)){
        console.log("matchfound");
       let token = jwt.sign({username : username},secretkey,{expiresIn:180});
        return res.json({
            success : true,
            err :null,
            token
            });
    }else{
       return res.status(401).json({
            success : false,
            token :null,
            err: 'Username or Password is incorrect'
        });
    }
    
});

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});


app.use(function(err,req,res,next) {
    if(err.name= 'UnauthorizedError'){
        res.status(401).json({
            success:false,
            err
        });
    }else{
        next(err);
    }
})

app.listen(PORT,() =>{
    console.log(`Server listening on port ${PORT}`);
});