import express from 'express';
// import axios from 'axois';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(PORT, () => console.log(`Server running ar http://localhost:${PORT}`))