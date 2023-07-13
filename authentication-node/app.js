const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);

const app = express();

const MONGO_URI = "mongodb+srv://rudrasro:Sup74672@cluster0.ckq5ap9.mongodb.net/testJulyDb?retryWrites=true&w=majority";

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new mongoDbSession({
    uri: MONGO_URI,
    collection: "sessions",
});

app.use(
    session({
        secret: "This is node class",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
)

//MongoDB connection

mongoose.connect(MONGO_URI).then(()=>{
    console.log('MongoDB connected')
}).catch(err=>{
    console.log(err)
});

app.get('/', (req, res) => {
    return res.send('This is your server.');
});

app.get('/myHtml', (req, res) => {
    return res.send(
        `<html>
            <head></head>
            <body>
                <h3>This is a form</h3>
                <form action="/register" method="POST">
                    <label for="name">Name</label>
                    <input type="text" name="name" />
                    <label for="email">Email</label>
                    <input type="email" name="email"></input>
                    <label for="tele">Telephone</label>
                    <input type="text" name="tele"></input>
                    <label for="password">Password</label>
                    <input type="password" name="password"></input>
                    <button type="submit">Submit</button>
                </form>
            </body>
        </html>`
    );
});

app.post('/register', async (req,res)=>{

    const {name, email, tele, password} = req.body;

    const user = new userSchema({
        name: name,
        email: email,
        tele: tele,
        password: password,
    });

    try{
        const userDb = await user.save(); //5sec
        
        //storing session in DB
        req.session.isAuth = true;

        return res.send({
            status: 201,
            message: "Registration successful",
            data: userDb,
        });
    }catch(error){
        return res.send({
            status: 400,
            message: "Database error",
            error: error,
        });
    }
});


app.listen(3008, () => {
    console.log('server is running on port 3008');
});


//mongoose --> schema --> userSchema --> user.save