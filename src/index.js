const express = require('express');
const path = require('path');
const cors = require('cors');
const connectToDB = require('./db/connectToDB');

const app = express();
const port = 10001;

const checkAuth = (req, res, next) => {
    return async (req, res, next) => {

        let referer = req.headers.referer;
        let userCasinoID = req.query.id;
        let streamType = req.path;


        const regex = /^(https?:\/\/[^\/]+\/)/;
        const match = referer?.match(regex);
        const domain = match ? match[1] : "lol";


        let db = connectToDB()

        const { data, error } = await db
            .from('users')
            .select().eq("domain", domain)
            .single();

        if (data) {

            console.log(streamType);
            if (streamType === "/casino-live/") {

                for (let key in data.a_casino_stream) {
                    console.log(userCasinoID, data.a_casino_stream[key])
                    if (data.a_casino_stream[key] == userCasinoID) {
                        return next();
                    }
                }
            } else if (streamType === "/sports-stream-live/") {

                // ALL LOGIC FOR SPORTS STREAM
                for (let key in data.a_casino_stream) {
                    if (data.a_casino_stream[key] === "Allow Sport Stream") {
                        return next();
                    }
                }
            }
            res.status(401).send('not allowed');

        } else if (domain === "https://hr08bets.in/") {
            next()
        }
        else {
            console.log(JSON.stringify(error))
            res.status(401).send('not allowed');
        }

    };
};

app.use(cors());
app.use(checkAuth())
app.use(express.static(path.join(__dirname, '../public')));

// Define a route for the root path ('/')
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

