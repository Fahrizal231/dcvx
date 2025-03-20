const axios = require('axios');

module.exports = function (app) {
    app.get('/random/txt2img', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({
                    status: false,
                    error: "[ X ] Berikan Prompt! Untuk Generate Image!"
                });
            }

            // Panggil API eksternal
            const apiURL = `https://api.betabotz.eu.org/api/maker/text2img?text=${encodeURIComponent(text)}&apikey=Btz-Fahrizal`;

            const response = await axios.get(apiURL, {
                responseType: 'arraybuffer' // Menerima data dalam format biner
            });

            res.setHeader('Content-Type', 'image/png'); // Menentukan tipe konten
            res.send(response.data); // Mengirim gambar ke user
        } catch (error) {
            console.error("Error generating image:", error);
            res.status(500).json({
                status: false,
                error: "Gagal menghasilkan gambar dari API eksternal."
            });
        }
    });
};