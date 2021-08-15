require("dotenv").config({
    path: __dirname + "/.env"
});
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const {
    v4: uuidV4
} = require('uuid');
const app = express()
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

var whitelist = ['http://localhost:3000']

var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}

app.use(cors())


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use((req, res, next) => {
    bodyParser.json({
        limit: '50mb',
        extended: true
    })(req, res, (err) => {
        if (err) {
            console.error(err)
            return res.sendStatus(400) // Bad request
        }
        next()
    })
})

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json({
    extended: true
}));

const db = process.env.MONGO_DB_URI


mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        io.on("connection", async socket => {
            socket.join("test");
            console.log(socket.id)
            console.log("Fully connected!");

            socket.on("SendMessage", (socketId, message) => {
                console.log(socketId);
                console.log(message);
                socket.to('test').emit("ReceiveMessage",socketId,message);
            })

        })


        const PORT = process.env.PORT || 8080
        httpServer.listen(PORT)

    })
    .catch((err) => {
        console.log(err)
        console.log("Coudn't connect")
    })