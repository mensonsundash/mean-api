import express from 'express';
import roleRouter from './role.routes.js';
import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';

const app = express.Router();

//Router Middleware
app.use('/role', roleRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

export default app;