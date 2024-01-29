const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken , secretKey} = require('../config/authenticator');
const db = require('../database/db.js');

// Registration route
router.post('/register', async (req, res) => {
    try {
        const{name, username, password, role_id} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("helllooooooooooooooooooooooooo")
        const insertUserQuery = 'INSERT INTO users (name, username, password, role_id) VALUES  (?, ?, ?, ?)';
        await db.promise().execute(insertUserQuery, [name, username, hashedPassword, role_id]);

        res.status(201).json({
            message: 'User successfully registered'
        })
    }
    catch (error) {
        console.error('Error registration.', error);
        res.status(500).json({
            error: 'Internal Server Error'
        }); 
    };
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const getUserQuery = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.promise().execute(getUserQuery, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password'});
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return res.status(401).json({ error: 'invalid username or password'});
        }

        const token = jwt.sign({ userId: user.id, username: username}, secretKey, {expiresIn: '1h'});

        res.status(200).json({token});
        } catch (error) {
            console.error('error logging in', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
});

router.get('/users',authenticateToken ,(req, res) => {
    
    try {
        db.query('SELECT id, name, username, role_id FROM users', (err, result) => {
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

// Get user by ID route
router.get('/user/:id', authenticateToken, (req, res) => {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true , message: 'Please provide a user id'});
    }
    
    try {
        db.query('SELECT id, name, username FROM users WHERE id = ?', [user_id], (err, result) => {
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

// Update user by ID route
router.put('/user/:id', authenticateToken, async (req, res) => {
    let user_id = req.params.id;
    
    const {name, username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (!user_id || !name || !username || !password) {
        return res.status(400).send({ error: user, message: 'Invalid username or password!' });
    }
    
    try {
        
        db.query('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', [name, username, hashedPassword, user_id], (err, result, fields) => {
            
            if(err) {
                console.error('Updated Unsuccessful!', err);
                res.status(500).json({ error: err, message: 'Internal Server Error'});
            } else {
                console.log('Updated Success!');
                res.status(200).json(result);
            }
        });
        
    } catch (error) {
        console.error('Error loading users', error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }
});

// Delete user by ID route
router.delete('/user/:id', authenticateToken, (req, res) => {
    let user_id = req.params.id;

    if(!user_id) {
        return res.status(400).send({ message: 'Please provide a user_id'});
    }

    try {

        db.query("DELETE FROM users WHERE id = ?", user_id, (err, result, fields) => {

            if (err) {
                console.error('Error deleting user', err);
                res.status(500).json({ error: err, message: 'Internal Server Error' });
            } else {
                console.log('User deleted successfully!');
                res.status(200).json(result);
            }
        });     
    } catch (error) {
        console.error('Error loading user', error);
        res.status(500).json({ error: error, message: 'Internal Server Error' });
    }});


module.exports = router;