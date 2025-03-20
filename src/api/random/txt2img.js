const axios = require('axios');

module.exports = function (app) {
    app.get('/random/txt2img', async (req, res) => {
        try {
            const apiURL = `https://api.betabotz.eu.org/api/random/txt2img?apikey=Btz-Fahrizal`;

            const response = await axios.get(apiURL, {
                responseType: 'arraybuffer' // Menerima gambar langsung
            });

            res.setHeader('Content-Type', 'image/png'); // Pastikan tipe gambar
            res.send(response.data); // Kirim gambar langsung
        } catch (error) {
            console.error("Error fetching random image:", error);
            res.status(500).json({
                status: false,
                error: "Gagal mengambil gambar dari API eksternal."
            });
        }
    });
};