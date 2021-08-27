const express = require('express')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
const fetch = require("node-fetch");
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const Project = require('./models/project')
const baseUrl = 'http://localhost';
const usersServiceUrl = baseUrl + ':8082';
const port = 8083

var mongoDB = 'mongodb+srv://cata:cata@cluster0.wcbqw.mongodb.net/first?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/project', async (req, res) => {
    let newProject = req.body
    let key = req.body.name.substring(0,3).toUpperCase() 
    var addProject=new Project({name:newProject.name, type:newProject.type, key:key,user_id:newProject.user_id})
    await Project.create(addProject)
    res.send(newProject)
})

app.get('/project', async (req, res) =>{
    // const record= await Project.find({'type':req.query.type}).exec()
    const record= await Project.find({})
    userIds=record.map(p => p.user_id);
    users=[]
    await fetch(usersServiceUrl + '/allusersselected', 
    { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userIds)
    })
    .then(res => res.json())
    .then(data => users = data);

    result=[]
    for (let index = 0; index < record.length; index++) {

        const componentDTO = {
            _id: record[index]._id,
            name: record[index].name,
            type: record[index].type,
            user_id: users[index].username,
        }
        result.push(componentDTO);   
    }  

    res.json(result)
})
app.post('/projectId', async (req, res) =>{
    // const record= await Project.find({'type':req.query.type}).exec()
    const record= await Project.find({"_id": req.body._id})
    console.log(record)
    res.json(record)
})


app.post('/allprojects', async (req, res) => {
    let result = [];
    if (req.body.length) {
        for (let index = 0; index < req.body.length; index++) {
            const project = await Project.find({ '_id': req.body[index] })
            result.push(project[0]);
        }
    }

    res.json(result)
})

app.get('/project/kanban', async (req, res) =>{
    const record= await Project.find({'type':'kanban'}).exec()
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