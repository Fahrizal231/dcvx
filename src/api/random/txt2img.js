const axios = require('axios');

module.exports = function (app) {
    app.get('/random/txt2img', async (req, res) => {
        try {
            const { text } = req.query;

            // Jika tidak ada text, kembalikan error
            if (!text) {
                return res.status(400).json({
                    status: false,
                    error: "Berikan teks untuk generate gambar."
                });
            }

            const apiURL = `https://api.betabotz.eu.org/api/maker/text2img?text=${encodeURIComponent(text)}&apikey=Btz-Fahrizal`;

            const response = await axios.get(apiURL, {
                responseType: 'arraybuffer' // Mengharapkan gambar sebagai respons
            });

            res.setHeader('Content-Type', 'image/png'); // Pastikan tipe gambar
            res.send(response.data); // Kirim gambar langsung
        } catch (error) {
            console.error("Error fetching image:", error);
            res.status(500).json({
                status: false,
                error: "Gagal mengambil gambar dari API eksternal."
            });
        }
    });
};