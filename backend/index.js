import express from 'express';
import { apiController } from './controllers/api.controller.js';
const app = express();
const PORT = 3000;

//middleware
app.use(express.json());

apiController(app);

app.listen(PORT, () =>{
  console.log('Server runnin at ${PORT}');
});


