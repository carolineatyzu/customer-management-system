const soldiersRouter = require("express").Router();
const soldierRouter = require("express").Router();
const mongoose = require('mongoose');
const multer = require("multer");

const { getSoldiers,getSoldier,createSoldier,updateSoldier,deleteSoldier,updateAvatar } = require('./api');
const { str2num,checkId,checkLoop,deleteSupInfo } = require('../middleware');

// connect to db
mongoose.connect("mongodb+srv://test:test@cluster0.hh8tk.mongodb.net/us-army?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => console.log('db connected'));
db.on('error', console.error.bind(console, 'connection error:'));
const upload = multer();

// get soldier list
soldiersRouter.get('/', str2num, getSoldiers);
soldiersRouter.use((req,res) => {
    console.dir(req.url);
    res.status(404).json({
        message: "Route in soldiers API not found",
    });
});

// get specific soldier
soldierRouter.all('/')
.get('/:id',checkId, getSoldier)
.post('/',createSoldier)
.post('/avatar/:id',checkId,upload.single("avatar"),updateAvatar)
.put('/:id',checkId,checkLoop,updateSoldier)
.delete('/:id',checkId,deleteSupInfo,deleteSoldier);
soldierRouter.use((req,res) => {
    console.dir(req.url);
    res.status(404).json({
        message: "Route in soldier API not found",
    });
});

module.exports = {
    soldiersRouter,
    soldierRouter
};