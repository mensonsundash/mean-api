import express from 'express';
import roleRouter from './role.routes.js';
const app = express.Router();

app.use('/role', roleRouter);

export default app;