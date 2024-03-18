const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = 3000;

// Middleware per gestire i file in arrivo
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nessun file caricato.');
    }

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

        const webhookUrl = 'https://discord.com/api/webhooks/1219277875002474567/NV2FQHfqnI-N_5Zc1L6Hjzv1BMApLKvXP2gwNgXELksYEXweZm4o4CqoZNQNdPE2AhJ0';

        await axios.post(webhookUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        fs.unlinkSync(req.file.path); // Elimina il file dal server dopo l'invio
        res.send('File inviato con successo.');
    } catch (error) {
        console.error('Errore durante linvio del file:', error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

