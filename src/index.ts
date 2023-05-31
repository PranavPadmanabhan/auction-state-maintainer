import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import "dotenv/config"
import { ListenAuctions } from './utils/helper-functions';

const app = express();



const port = process.env.PORT
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
});




mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log(`mongoDB connected..`)
})

app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
    ListenAuctions()
})  