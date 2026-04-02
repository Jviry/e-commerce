

export const apiController = (app) => {
  app.use('/auth', authRouter);
  app.use('/products', productRouter);
};
