const nb = require('express').Router();
const fs = require('fs');
const nanoid = require('nanoid');
const util = require('util');
const db = require('../db/db.json')

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
);
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

nb.get('/', (req, res) => {
    console.info(`${req.method} note was saved`);

    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

nb.post('/', (req, res) => {
    console.info(`${req.method} note was saved`);

    const {title, text} = req.body

    if (title && text) {
        const newNote = {
            title,
            text,
            id: nanoid(),
        };
        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote,
        };
        
        res.json(response);
    }
    })
nb.get('/:id',(req, res)=>{
    for(let i = 0; i < db.length; i++){
        if(db[i].id === req.params.id){
            res.json(db[i])
        }
    }
})
    nb.delete('/:id',(req, res) => {
        const id = req.params.id
        readAndDelete(id, './db/db.json')
        res.send(`Delete was called for ${id}`)
    })  
    


module.exports = nb;