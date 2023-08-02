import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import { routers } from './routers';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', routers);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});