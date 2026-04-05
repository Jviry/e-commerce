import express from 'express';
import { apiController } from './controllers/api.controller.js';
import serverless from 'serverless-http';
const app = express();
const PORT = 3000;

//middleware
app.use(express.json());

apiController(app);

export const handler = serverless(app);
app.listen(PORT, () =>{
  console.log(`Server runnin at ${PORT}`);
});


