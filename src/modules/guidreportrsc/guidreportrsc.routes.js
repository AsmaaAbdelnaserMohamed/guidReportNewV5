// guidreportrscdata_routes.js

import express from "express";
import { getAllData, saveData } from "./guidreportrsc.controller.js";
import { upload } from "../../middleware/fileUpload.js";
import authenticateToken from "../../middleware/auth.middleware.js";


const router = express.Router();

router.post('/api/saveData',authenticateToken, saveData);

router.get('/api/getAllRequest',authenticateToken, getAllData);

router.post('/api/uploadImage', upload, (req, res) => {
    res.json({ success: true, message: 'successful for uploaded files!' });
});

export default router;