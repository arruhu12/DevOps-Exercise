import express, {Express} from 'express';
import { routers } from './routers';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

config();

const app: Express = express();
const port = parseInt(process.env.APP_PORT!);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', routers);

app.listen(port, process.env.APP_HOST!, () => {
    console.log(`Transaction service listening on port ${port}
    with host address ${process.env.APP_HOST}.`)
});