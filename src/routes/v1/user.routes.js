import express from 'express';
import { getAllUsers, getById } from '../../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../../middlewares/verifyToken.js';

const app = express.Router();

app.get("/", verifyAdmin, getAllUsers);
app.get("/:id", verifyUser, getById);

export default app;