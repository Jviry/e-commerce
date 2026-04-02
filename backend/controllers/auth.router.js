import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/signup', async (req, res) =>{
  try{
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING * ',
      [username, email, hashedPassword]
    );
    
    res.status(200).json(result.rows[0]);
  }catch(error){
    if(error.code === '23505'){
      res.status(400).json('Email already registered');
    }else{
      res.status(500).json({message: error.message});
    }
  }
});

router.post('/login', async (req, res) =>{
  try{
    const{ username, password } = req.body;

    const userResult = await pool.query(
      'SELECT * FROM user WHERE username = $1',
      [username]
    );

    if(userResult.rows.length === 0){
      return res.status(400).json('Invalid username');
    }
    
    const user = userResult.rows[0];
    
    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json('Invalid password');
    }
    
    const token = jwt.sign(
      { userID: user.userID, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h'}
    );
    res.status(200).json({
      message: 'Login Successfull',
      token
    });

  }catch(error){
    res.status(500).json({message: error.message});
  }

});

router.post('/logout', async (req, res) =>{

});
