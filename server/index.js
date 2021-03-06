const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const register = require("./user/register");
const login = require("./user/login");
const isUserAuth = require("./user/isUserAuth");
const confirm = require("./user/confirm");
const fgpass = require("./user/fgpass");
const changepass = require("./user/changepass");
const token = require("./user/token");
const tokenpass = require("./user/tokenpass");
const steps = require("./user/steps");
const editProfile = require("./user/editProfile");
const editPassword = require("./user/editPassword");
const editInfo = require("./user/editInfo");
const editLocation = require("./user/editLocation");
const getData = require("./user/getData");
const getDataByUser = require("./user/getDataByUser");
const getIdByUser = require("./user/getIdByUser");
const getImages = require("./user/getImages");
const editGallery = require("./user/editGallery");
const removeimage = require("./user/removeimage");
const defaultimage = require("./user/defaultimage");
const removeProfilePic = require("./user/removeProfilePic");
const like = require("./user/like");
const getlike = require("./user/getlikes");
const report = require("./user/report");
const getreport = require("./user/getreports");
const block = require("./user/block");
const getblock = require("./user/getblock");
const getposition = require("./user/getposition");
const unblockUser = require("./user/unblockUsers");
const gethistory = require("./user/gethistory");
const deleteAccount = require("./user/deleteAccount");
const subscribers = require("./user/subscribers");
const getusersBlocked = require("./user/getUsersBlocked");
const totalMatched = require("./user/totalMatched");
const getusers = require("./user/getusers");
const insertmsg = require("./user/insertmsg");
const updateLastseen = require("./user/updateLastSeen");
const getmatchedusr = require("./user/getmacheduser");
const getmsg = require("./user/getmsg");
const getusername = require("./user/getusername");
const removeNotificaion = require("./user/removenotification");
const notification = require("./user/notification");
const redis = require("redis");
const client = redis.createClient({ detect_buffers: true });
const http = require("http");
let users = {};
const socketIo = require("socket.io");
const { use } = require("bcrypt/promises");
const server = http.createServer(app);
const io = socketIo(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", function (socket) {
  socket.on("userconnected", function (username) {
    var usr = username;
    if (usr) {
      users[username] = socket;
      client.set(username, socket.id);
      client.dbsize(function (err, nuMkey) {
        socket.broadcast.emit("usersOnline", nuMkey);
      });
      socket.broadcast.emit("online", usr);
    }
    socket.on("disconnect", () => {
      if (usr) {
        client.del(usr);
        client.dbsize(function (err, nuMkey) {
          socket.broadcast.emit("usersOnline", nuMkey);
        });
      }
      var data = { usr: usr, lastseen: new Date() };
      socket.broadcast.emit("offline", data);
    });
  });
  socket.on("stateOfuser", function (profile_name) {
    client.get(profile_name, function (err, reply) {
      if (reply !== null) {
        socket.emit("online", profile_name);
      } else {
      }
    });
  });
  socket.on("send_message", function (data) {
    client.get(data?.to_username, function (err, reply) {
      if (reply !== null) {
        if (users[data?.to_username]) {
          users[data?.to_username].emit("new_message", data);
          users[data?.to_username].emit("notification_message", data?.to_username);
        }
      } else {
      }
    });
  });
  socket.on("getUsersOnline", function (data) {
    if (data === "true") {
      client.dbsize(function (err, nuMkey) {
        socket.emit("usersOnline", nuMkey);
      });
    }
  });
  socket.on("setLike", function (data) {
    if (users[data]) {
      users[data].emit("notification_Like", data);
    }
  });
  socket.on("viewed your profile", function (data) {
    if (users[data]) {
      users[data].emit("notification_viewed", data);
    }
  });
  socket.on("unliked", function (data) {
    if (users[data]) {
      users[data].emit("unliked", data);
    }
  });
  socket.on("checkuser", function (data) {
    client.del(data);
    var data = { usr: data, lastseen: new Date() };
    socket.broadcast.emit("offline", data);
  });
}).setMaxListeners(0);

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/images", express.static("./images"));
app.use("/register", register);
app.use("/getusername", getusername);
app.use("/removeNotificaion", removeNotificaion);
app.use("/notification", notification);
app.use("/getmatcheduser", getmatchedusr);
app.use("/totalMatched", totalMatched);
app.use("/updateLastseen", updateLastseen);
app.use("/getmsg", getmsg);
app.use("/insertmsg", insertmsg);
app.use("/subscribers", subscribers);
app.use("/unblock", unblockUser);
app.use("/getusersblocked", getusersBlocked);
app.use("/login", login);
app.use("/confirm", confirm);
app.use("/fgpass", fgpass);
app.use("/token", token);
app.use("/tokenpass", tokenpass);
app.use("/getusers", getusers);
app.use("/changepass", changepass);
app.use("/steps", steps);
app.use("/editProfile", editProfile);
app.use("/editPassword", editPassword);
app.use("/edit", editInfo);
app.use("/editLocation", editLocation);
app.use("/getData", getData);
app.use("/getDataByUser", getDataByUser);
app.use("/getIdByUser", getIdByUser);
app.use("/getImages", getImages);
app.use("/isUserAuth", isUserAuth);
app.use("/editGallery", editGallery);
app.use("/removeimage", removeimage);
app.use("/defaultimage", defaultimage);
app.use("/removeProfilePic", removeProfilePic);
app.use("/like", like);
app.use("/getLike", getlike);
app.use("/report", report);
app.use("/getReport", getreport);
app.use("/block", block);
app.use("/getBlock", getblock);
app.use("/getusername", getusername);
app.use("/getposition", getposition);
app.use("/gethistory", gethistory);
app.use("/deleteAccount", deleteAccount);

server.listen(3001, () => {});
