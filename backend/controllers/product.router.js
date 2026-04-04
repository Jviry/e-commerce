import { pool } from '../db.js';
import express from 'express';
import { authenticate }  from '../middleware/authenticate.middleware.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) =>{
  try{
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1 ) * limit;

    const result = await pool.query(
      'SELECT * FROM products LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.status(200).json({
      page,
      limit,
      data: result.rows
    });

  }catch(error){
    res.status(500).json({message: error.message});
  }
});

router.get('/:id', authenticate, async (req, res) => {

  try{
    const { id } = req.params;
    const result = await pool.query(
    'SELECT * FROM products WHERE "productID" = $1',
    [id]
    );
    if(result.rows.length === 0){
      return res.status(400).json({message: "Product not found"});
    }

    res.status(200).json(result.rows[0]);

  }catch(error){
    res.status(500).json({message: error.message});
  }
});

//admin only , implement on authrole middleware later
router.post('/', authenticate, async (req, res) => {
  try{
    const fields = [];
    const values = [];
    const placeholders = [];
    let count = 1;
for(let key in req.body){
      fields.push(key);
      values.push(req.body[key]);
      placeholders.push(`$${count}`);
      count++;
    }
    const result = await pool.query(
    `INSERT INTO products(${fields.join(", ")}) VALUES(${placeholders.join(",")}) RETURNING *`,
    values
    );

    res.status(200).json(result.rows[0]);
  }catch(error){
    res.status(500).json({message: error.message});
  }
});


router.put('/:id', authenticate, async (req, res) => {
  try{
    const {id} = req.params;
    const fields = [];
    const values = [];
    let count = 1;

    for(let key in req.body){
      fields.push(`${key} = $${count}`);
      values.push(req.body[key]);
      count++;
    }
    values.push(id);

    const result = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE "productID" = $${count} RETURNING *`,
      values
    );

    if(result.rows.length === 0){
      return res.status(400).json('Invalid product id');
    }

    res.status(200).json(result.rows[0]);
  }catch(error){
    res.status(500).json({message: error.message});
  }
});

router.delete('/:id', authenticate, async (req, res) =>{
  try{
   const {id} = req.params;
   const result = await pool.query(
      'DELETE FROM products WHERE "productID" = $1 RETURNING *',
      [id]
    );
    
    if(result.rows.length === 0){
      return res.status(400).json('Product not found');
    }

    res.status(200).json({
      message: 'Product Deleted',
      data: result.rows[0]
    });
  }catch(error){
    res.status(500).json({message: error.message});
  }
});

export default router;
