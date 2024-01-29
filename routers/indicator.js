const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken , secretKey} = require('../config/authenticator');
const db = require('../database/db.js');

// user register
router.post('/indicator', async (req, res) => {
    try {
        const{description, evaluation_id, user_id} = req.body;

        const insertUserQuery = 'INSERT INTO indicators (description, evaluation_id,user_id) VALUES  (?, ?, ?)';
        await db.promise().execute(insertUserQuery, [description, evaluation_id, user_id]);

        res.status(201).json({
            message: 'Indicator Successfully Added!'
        })
    }
    catch (error) {
        console.error('Error registration.', error);
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    };
});
//all user information
router.get('/indicators', (req, res) => {
    
    try {
        db.query('SELECT id, description, evaluation_id, user_id FROM indicators', (err, result) => {
            if (err) {
                console.error('Indicators Loading Error', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({request: result});
            }
        });
    } catch (error) {
        console.error('Error loading Indicators', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user by ID route
router.get('/indicator/:id', authenticateToken, (req, res) => {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true , message: 'Please provide a user id'});
    }
    
    try {
        db.query('SELECT id, description, evaluation_id, user_id FROM indicators WHERE id = ?', [user_id], (err, result) => {
            if (err) {
                console.error('Error', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json({request: result});
            }
        });
    } catch (error) {
        console.error('Error loading users', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/indicator/:id', authenticateToken, async (req, res) => {
    let id = req.params.id;
    
    const {description, evaluation_id, user_id} = req.body;
    
    try {
        
        db.query('UPDATE indicators SET description = ?, user_id = ?, evaluation_id = ? WHERE id = ?', [description, user_id, evaluation_id, id], (err, result, fields) => {
            
            if(err) {
                console.error('Indicators Updated Unsuccessful!', err);
                res.status(500).json({ error: err, message: 'Internal Server Error'});
            } else {
                console.log('Updated Success!');
                res.status(200).json(result);
            }
        });
        
    } catch (error) {
        console.error('Error loading indicators', error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
});

router.delete('/indicator/:id', authenticateToken, (req, res) => {
    let id = req.params.id;

    if(!id) {
        return res.status(400).send({ message: 'Please provide a indicators id'});
    }

    try {

        db.query("DELETE FROM indicators WHERE id = ?", id, (err, result, fields) => {

            if (err) {
                console.error('Error deleting indicator', err);
                res.status(500).json({ error: err, message: 'Internal Server Error' });
            } else {
                console.log('Indicator deleted successfully!');
                res.status(200).json(result);
            }
        });     
    } catch (error) {
        console.error('Error loading user', error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }});

module.exports = router;