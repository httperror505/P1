const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const { authenticateToken } = require('../config/authenticator');
const secretKey = "mj";


const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(req.body)
    try{
        const {name, username, password} = req.body;
        const hashPass = await bcrypt.hash(password, 10);

        const queryInsert = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)'
        await db.promise().execute(queryInsert, [name, username, hashPass])

        res.status(201).json({message: 'User registered successfuly'})
    } catch (error){
         console.error("ERROR registering user: ", error)
         res.status(500).json({error: "internal server error"})
    }
});

router.post('/login', async (req, res) => {
      
    try {
        const{username, password} = req.body;

        const getUserQuery = 'SELECT * FROM users WHERE username = ?';
        const[rows] = await db.promise().execute(getUserQuery,[username]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Invalid username or password'});
        }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
        return res.status(404).json({ error: 'invalid username or password'});
    }

    const token =jwt.sign({ userId: user.id, username: username}, secretKey, {expiresIn: '1h'});

    res.status(200).json({token});
} catch (error) {
    console.error('error logging in userr', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

router.get('/users', (req, res) => {
 
    try {
        db.query('SELECT id, name FROM users',(err, result) => {

            if(err) {
                console.error('error fetching items:', err);
                req.status(500).json({ error: 'Internal Server Error' });
            }else{
                res.status(200).json({result});
            }
        });

    } catch (error) {
        console.error('Error loading users', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});

router.get('/user/:id', authenticateToken, (req, res) => {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({error: true, message :'Please provide user_ID'});
    }
    try{
        db.query('SELECT id, name, username FROM users WHERE id = ?', user_id, (err, result) => {
          if(err){
            console.error('error fetching items:', err);
            res.status(500).json({ message: 'Internal server error'})
          } else {
            res.status(200).json(result);
          }  
        });

    } catch (errror){

        console.error('Error loadng user:', error);
        res.status(500).json({error: 'interrnal server error'})
    }
});

router.delete('/user/:id', authenticateToken, (req, res) => {
    
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'pese provide user_id' });
    }
       try {
        db.query('DELETE FROM users WHERE id = ?', user_id, (err, result, fields) => {

            if (err) {
                console.error('error deleting items', err);
                res.status(500).json({message: 'inetrnal server error'});
            } else {
                res.status(200).json(result);
        }
    });

       }catch (error){
        console.error('error loadng user:', error);
        res.status(500).json({error: ' internal serever error'});
       }
});

router.put('/user/:id', authenticateToken, async (req, res) => {
    let user_id = req.params.id;
    
    const{name,username,password} = req.body;
    console.log(password)
    const hashedPassword = await bcrypt.hash(password,10);

    if (!user_id || !name || !username || !password) {
        return res.status(400).send({error: user,message:'please provide name,username and password'});
    } 

    try { 
        db.query('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?',[name, username, hashedPassword, user_id],(err,result, fields) => {
        if (err){
            console.error('error updating:', err);
            res.status(500).json({message:'internall server error'});
        }else {
            res.status(200).json(result);
        }
    });

    } catch (error) {
        console.error('error loading user', error);
        res.status(500).json({ error: 'internnal server error' });
    }
});

module.exports = router;