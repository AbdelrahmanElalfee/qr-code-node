const express = require('express');
const qr = require("qrcode");
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use('/qr-codes', express.static('qr-codes'));

app.get('/', (req, res, next) => {
    res.send('Hello');
})

app.get('/generate/:url', (req, res) => {
    const url = req.params.url;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
    }
    const currentDate = new Date().toISOString().replace(/[:.-]/g, '_');
    let filename = `qr-codes/qr-${currentDate}.png`;

    qr.toFile(filename, url, {errorCorrectionLevel: 'H', width: 300, version: 10}, (err) => {
            res.json({'image': `https://qr-69sk.onrender.com/${filename}`});
    });
});

app.listen(port, () => {
    console.log(`QR code generator API is running on port ${port}`);
});