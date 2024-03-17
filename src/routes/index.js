import express from 'express';
import v1Routes from './v1/index.js';
const app = express.Router();

app.use('/v1', v1Routes);

export default app;