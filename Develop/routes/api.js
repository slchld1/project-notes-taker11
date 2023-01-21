const nb = require('express').Router();
const fs = require('fs');
const nanoid = require('nanoid');
const util = require('util');
const db = require('../db/db.json')
// Reading File
const readFromFile = util.promisify(fs.readFile);

// Writing file into desired destination (./db/db.json)
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);

// Reading and Appending file into ./db/db.json (data must be parsed)
const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
    }
    });
};

// Reading and Deleting file/Updating files in ./db/db.json (data must be parsed)
const readAndDelete = (id, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
    } else {
        const parsedData = JSON.parse(data)
        for(let i = 0;i < parsedData.length; i++){
            if(parsedData[i].id === id){
                parsedData.splice(i, 1)
                writeToFile(file, parsedData)
            }
        }
    }
    });
};

// Get request api for saving notes
nb.get('/', (req, res) => {
    console.info(`${req.method} note was saved`);

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// Post request for saving and recalling new notes
nb.post('/', (req, res) => {
    console.info(`${req.method} note was saved`);

    const {title, text} = req.body

    if (title && text) {
        // Note is saved with an id created by nanoid
        const newNote = {
            title,
            text,
            id: nanoid(),
        };
        // New Note body created
        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote,
        };
        
        res.json(response);
    }
    })

// Get request in order to view specific data by id for test
nb.get('/:id',(req, res)=>{
    for(let i = 0; i < db.length; i++){
        if(db[i].id === req.params.id){
            res.json(db[i])
        }
    }
})

// Delete request for selected note
    nb.delete('/:id',(req, res) => {
        const id = req.params.id
        readAndDelete(id, './db/db.json')
        res.send(`Delete was called for ${id}`)
    })  
    


module.exports = nb;