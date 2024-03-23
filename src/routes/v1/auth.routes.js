import express from 'express';
import { forgetPassword, login, register, registerAdmin, resetPassword } from '../../controllers/auth.controller.js';
const app = express.Router();

app.post("/register", register);
app.post("/login", login);
app.post("/register-admin", registerAdmin);
app.post("/forget-password", forgetPassword)
app.post('/reset-password', resetPassword)
export default app;