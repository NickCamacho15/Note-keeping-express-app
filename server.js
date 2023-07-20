// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Set up Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use public folder for static assets
app.use(express.static(path.join(__dirname, 'public')));

// Get the notes data from the db.json
let notesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf-8')
);

// HTML routes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// API Routes
app.get('/api/notes', (req, res) => {
    res.json(notesData);
});

app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    newNote.id = uuidv4();
    notesData.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(notesData, null, 2)
    );
    res.json(notesData);
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Start the server
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});

