
import mongoose from "mongoose";
import 'dotenv/config'
import { ListenAuctions } from "./utils/helper-functions";


mongoose.connect(process.env.MONGO_URL!).then(() => {
    console.log(`mongoDB connected..`)
    ListenAuctions()
})

