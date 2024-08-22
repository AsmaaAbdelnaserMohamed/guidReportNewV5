// fileUpload.js file 

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const requestNumber = req.body['requestNumber'];
        if (!requestNumber) {
            return cb(new Error('requestNumber is required'));
        }

        // Network path with path.join for cross-platform compatibility
        const dir = path.join('\\\\192.168.1.96\\images', requestNumber);

        // Check if directory exists, if not create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const requestNumber = req.body['requestNumber'];
        if (!requestNumber) {
            return cb(new Error('requestNumber is required'));
        }

        const dateTime = moment().format('YYYY-MM-DD-h-mm-ss A');
        let newFileName;

        switch (file.fieldname) {
            case 'kroqui-image':
                newFileName = `k-${requestNumber}-${dateTime}${path.extname(file.originalname)}`;
                break;
            case 'camera_image':
                newFileName = `img-${requestNumber}-${dateTime}${path.extname(file.originalname)}`;
                break;
            case 'applicant-signature':
                newFileName = `S1-${requestNumber}-${dateTime}${path.extname(file.originalname)}`;
                break;
            case 'surveyor-signature':
                newFileName = `S2-${requestNumber}-${dateTime}${path.extname(file.originalname)}`;
                break;
            default:
                newFileName = `${requestNumber}-${dateTime}${path.extname(file.originalname)}`;
        }

        cb(null, newFileName);
    }
});

const upload = multer({ storage: storage }).fields([
    { name: 'kroqui-image', maxCount: 1 },
    { name: 'camera_image', maxCount: 1 },
    { name: 'applicant-signature', maxCount: 1 },
    { name: 'surveyor-signature', maxCount: 1 }
]);

export { upload };