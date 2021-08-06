const express = require('express')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const Project = require('./models/project')

const port = 8083

var mongoDB = 'mongodb+srv://cata:cata@cluster0.wcbqw.mongodb.net/first?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/project', async (req, res) => {
    let newProject = req.body
    var addProject=new Project({name:newProject.name, type:newProject.type, user_id:newProject.user_id})
    await Project.create(addProject)
    res.send(newProject)
})

app.get('/project', async (req, res) =>{
    // const record= await Project.find({'type':req.query.type}).exec()
    const record= await Project.find({})
    console.log(record)
    res.json(record)
})

app.get('/project/kanban', async (req, res) =>{
    const record= await Project.find({'type':'kanban'}).exec()
    console.log(record)
    res.json(record)
})
app.get('/project/scrum', async (req, res) =>{
    const record= await Project.find({'type':'scrum'}).exec()
    res.json(record)
})
app.get('/project/bugtracking', async (req, res) =>{

    const record= await Project.find({'type':'bug tracking '}).exec()
    res.json(record)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })