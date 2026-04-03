import authRouter from './auth.router.js';

export const apiController = (app) => {
  app.use('/auth', authRouter);
};
