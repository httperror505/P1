const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken , secretKey} = require('../config/authenticator');
const db = require('../database/db.js');


// Registration route
router.post('/role', async (req, res) => {
    try {
        const{role_code, role_name} = req.body;

        const insertUserQuery = 'INSERT INTO roles (role_code, role_name) VALUES  (?, ?)';
        await db.promise().execute(insertUserQuery, [role_code, role_name]);

        res.status(201).json({
            message: 'Role Successfully Added!'
        })
    }
    catch (error) {
        console.error('Error registration.', error);
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    };
});

//get all routes
router.get('/roles', (req, res) => {
    
    try {
        db.query('SELECT * FROM roles', (err, result) => {
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

// Update roles
router.put('/role/:id', authenticateToken, async (req, res) => {
    let role_id = req.params.id;
    
    const {role_code, role_name} = req.body;
    
    try {
        
        db.query('UPDATE roles SET role_code = ?, role_name = ? WHERE id = ?', [role_code, role_name, role_id], (err, result, fields) => {
            
            if(err) {
                console.error('Roles Update Unsuccessful!', err);
                res.status(500).json({ error: err, message: 'Internal Server Error'});
            } else {
                console.log('Roles Updated Success!');
                res.status(200).json(result);
            }
        });
        
    } catch (error) {
        console.error('Error loading roles', error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
});

// Delete roles
router.delete('/role/:id', authenticateToken, (req, res) => {
    let id = req.params.id;

    if(!id) {
        return res.status(400).send({ message: 'Please provide a user_id'});
    }

    try {

        db.query("DELETE FROM roles WHERE id = ?", id, (err, result, fields) => {

            if (err) {
                console.error('Error deleting roles', err);
                res.status(500).json({ error: err, message: 'Internal Server Error' });
            } else {
                console.log('Roles deleted successfully!');
                res.status(200).json(result);
            }
        });     
    } catch (error) {
        console.error('Error loading user', error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }});

module.exports = router;