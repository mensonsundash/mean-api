import express from 'express';
const app = express.Router();

import { createRole, deleteRole, getAllRoles, updateRole } from '../../controllers/role.controller.js';

app.get('/', getAllRoles)
app.post('/', createRole);
app.put('/update/:id', updateRole)
app.delete('/:id', deleteRole)

export default app;