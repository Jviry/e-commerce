import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "standerlois";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
    return res.status(400).json('No token provided');
  }
  jwt.verify(token, JWT_SECRET, (error, user) => {
    if(error){
      return res.status(400).json({message: error.message});
    }
    req.user = user;
    next();
  });
};
