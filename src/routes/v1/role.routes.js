import express from 'express';
const app = express.Router();

import { createRole, deleteRole, getAllRoles, updateRole } from '../../controllers/role.controller.js';
import { verifyAdmin } from '../../middlewares/verifyToken.js';

app.get('/', getAllRoles)
app.post('/', createRole);
app.put('/update/:id', verifyAdmin, updateRole)
app.delete('/:id', verifyAdmin, deleteRole)

export default app;