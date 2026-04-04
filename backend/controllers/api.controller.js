import authRouter from './auth.router.js';
import productRouter from './product.router.js';

export const apiController = (app) => {
  app.use('/auth', authRouter);
  app.use('/products', productRouter);
};
