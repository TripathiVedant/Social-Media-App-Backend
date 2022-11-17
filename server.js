const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var cors = require('cors');
const path = require('path');
require("dotenv").config({ path: "./config.env" });
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
require('./socket')(io)
app.use(cors());
app.use(express.json());
// const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(cors(corsOptions))

// const auth = 
const posts = require("./routes/postRoutes");
const comments = require("./routes/commentsRoutes");

const followings = require("./routes/followingsRoutes");
const followers = require("./routes/followerRoutes");
const profiles = require("./routes/profileRoutes");

const verifyAuthentication = require("./middlewares/auth");

// app.use(express.static(path.join(__dirname, './client/build')));

// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, './client/build', 'index.html'));
// });

// const dbo = require("./db/conn");
const connectToDB = require("./db/conn");

connectToDB(process.env.ATLAS_URI);


app.use(express.static(path.join(__dirname, './client/build')));


app.use('/auth', require("./routes/authRoutes"))
app.use(verifyAuthentication);
app.use("/api/posts", posts);
app.use("/api/profile", profiles);
app.use("/api/comments", comments);
app.use("/api/followers", followers);
app.use("/api/followings", followings);
app.use("/api/conversations", require("./routes/conversation"));
app.use("/api/messages", require("./routes/message"));


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'));
});


http.listen(port, () => {
    // perform a database connection when server starts
    //   dbo.connectToServer(function (err) {
    //     if (err) console.error(err);

    //   });
    console.log(`Server is running on port: ${port}`);
});

// module.exports = {
//   io
// }