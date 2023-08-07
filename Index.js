const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const app = express();
const port = 4000;

const dataFilePath = 'notes.json';

app.use(bodyParser.json());

function readDataFromFile() {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } 
    catch (error) {
        return {};
    }
}

function writeDataToFile(data) {
    fs.writeFileSync(dataFilePath,JSON.stringify(data,null,2));

}

app.post('/api/notes',(req,res) => {
    const {title,content} = req.body;
    const id = Date.now().toString();
    const notes = readDataFromFile();
    notes[id] = {id,title,content};
    writeDataToFile(notes);
    res.status(201).json({message:'Note created',id});
});

app.get('/api/notes/:id',(req,res) => {
    const {id} = req.params;
    const notes = readDataFromFile();
    const note = notes[id];
    if(note) {
        res.json(note);
    } else {
        res.status(404).json({error:'Note not found'});
    }
});

app.get('/api/notes',(req,res) => {
    const notes = readDataFromFile();
    res.json(Object.values(notes));
});

app.post('/api/notes/search',async (req,res) => {
    const {searchTerm} = req.body;
    const notes =await readDataFromFile();
    const arr = [];
    let searchResults = Object.values(notes).filter (
        (note) => {
            if(note.title.toLowerCase().includes(searchTerm.toLowerCase())) arr.push(note);
        }
    );
    res.json(arr);
});

app.listen(port,() => {
    console.log("Server started successfully");
});