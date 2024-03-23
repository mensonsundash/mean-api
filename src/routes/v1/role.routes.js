import express from 'express';
const app = express.Router();

import { createRole, deleteRole, getAllRoles, updateRole } from '../../controllers/role.controller.js';
import { verifyAdmin } from '../../middlewares/verifyToken.js';

app.get('/', verifyAdmin, getAllRoles)
app.post('/', verifyAdmin, createRole);
app.put('/update/:id', verifyAdmin, updateRole)
app.delete('/:id', verifyAdmin, deleteRole)

export default app;