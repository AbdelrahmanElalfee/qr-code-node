const express = require('express');
const qr = require("qrcode");
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/generate', (req, res) => {
    const url = req.body.url;
    const currentDate = new Date().toISOString().replace(/[:.-]/g, '_');
    let filename = `qr-codes/qr-${currentDate}.png`;

    qr.toFile(filename, url,{ errorCorrectionLevel: 'H', width: 300, version: 10 },  (err) => {
        if (err) {
            console.error('Error generating QR code:', err);
            res.status(500).send('Internal Server Error');
        } else {
            fs.readFile(filename, (fileErr, fileData) => {
                if (fileErr) {
                    console.error('Error reading QR code file:', fileErr);
                    res.status(500).send('Internal Server Error');
                } else {
                    // Set the response content type and send the image
                    res.setHeader('Content-Type', 'image/png');
                    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                    res.send(fileData);

                    fs.unlink(filename, (deleteErr) => {
                        if (deleteErr) {
                            console.error('Error deleting QR code file:', deleteErr);
                        }
                    });
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`QR code generator API is running on port ${port}`);
});