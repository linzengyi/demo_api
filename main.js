import express from 'npm:express';
import { load } from "@std/dotenv";

const env = await load();

const PORT = env.PORT;

const app = express();

app.get('/api/version', (req, res) => {
    res.status(200).json({
        version: '0.1.0'
    });
});

app.listen(PORT, () => {
    console.log(`server listen Port: ${PORT}`);
});