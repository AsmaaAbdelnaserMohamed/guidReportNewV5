import express from "express";
import { dbConnection } from "./Database/db_connection.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/modules/guidreportrsc/guidreportrsc.routes.js";
import routerAuth from "./src/modules/user/user.routes.js";
import { globalError } from "./src/middleware/globalErrorHandling.js";
import listRouter from "./src/modules/listData/listdata.routes.js";

const app = express();
const port = process.env.PORT || 4000;

dotenv.config(); 
dbConnection();

app.use(cors());

// إضافة الرؤوس الخاصة بـ CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(router);
app.use(routerAuth);
app.use(listRouter);

// // Route to get current date
// app.get('/api/current-date', (req, res) => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');

//     // Return the date in yyyy-MM-dd format
//     res.json({ currentDate: `${year}-${month}-${day}` });
// });

app.use(globalError)
app.listen(port, () => {
    console.log(`Server is running on http:localhost:${port}`);
});
