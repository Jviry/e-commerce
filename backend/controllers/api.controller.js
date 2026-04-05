import authRouter from './auth.router.js';
import productRouter from './product.router.js';

export const apiController = (app) => {
  app.get('/', (req, res)=>{
    try{
      res.status(200).json({message : "YO THIS IS DEPLOYED YO"});
    }catch(error){
      res.status(500).json({message : error.message});
    }
  });
  app.use('/auth', authRouter);
  app.use('/products', productRouter);
};
