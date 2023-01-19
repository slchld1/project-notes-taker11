const nb = require('express').Router();
const fs = require('fs');
const nanoid = require('nanoid');
const util = require('util');

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
            nano_id: nanoid(),
        };
        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote,
        };
        
        res.json(response);
    }
    })
nb.delete('/:id', (req, res) => {
    
})


module.exports = nb;