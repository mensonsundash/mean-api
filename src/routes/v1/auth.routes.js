import express from 'express';
import { login, register, registerAdmin } from '../../controllers/auth.controller.js';
const app = express.Router();

app.post("/register", register);
app.post("/login", login);
app.post("/register-admin", registerAdmin);
export default app;