// listdata.routes.js
import express from 'express';
import authenticateToken from '../../middleware/auth.middleware.js';
import { getData } from './listdata.controller.js';


const listRouter = express.Router();

listRouter.get('/api/listdata', authenticateToken, getData);

export default listRouter;