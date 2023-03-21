const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
//Route 1: get all the notes using : POST "/api/auth/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    const note = await Note.find({ user: req.user.id });
    res.json(note);
})

//Route 2: Add a new using : POST "/api/auth/addnote"
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),]
    , async (req, res) => {
        try {

            const { title, description, tag } = req.body;
            //If there are error return bad error and errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({ title, description, tag, user: req.user.id })

            const savedNote = await note.save();

            res.json(savedNote);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error ");
        }
    })


//Route 3: Update note  new using : Put "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated and update it 


    let note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(400).send({ error: "not found" });
    }

    if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
})


//Route 3: Delete note  new using : DELETE "/api/notes/deletenote"  . Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        //find the note to be deleted and delete it 

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(400).send({ error: "not found" });
        }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "success": "Note has been deleted", note: note })

    }

    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error ");
    }
})
module.exports = router; 