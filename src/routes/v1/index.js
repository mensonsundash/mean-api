import express from 'express';
import roleRouter from './role.routes.js';
import authRouter from './auth.routes.js';

const app = express.Router();

app.use('/role', roleRouter);
app.use('/auth', authRouter);
export default app;