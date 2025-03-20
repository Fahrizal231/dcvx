const axios = require('axios');

module.exports = function (app) {
    app.get('/random/brat', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({
                    status: false,
                    error: "[ ❌ ] Mana Textnya?"
                });
            }

            const response = await axios.get(`https://aqul-brat.hf.space/api/brat?text=${encodeURIComponent(text)}`, {
                responseType: 'arraybuffer' // Pastikan respons diterima dalam format biner
            });

            res.setHeader('Content-Type', 'image/png'); // Set tipe konten ke gambar
            res.send(response.data); // Kirim gambar sebagai respons langsung
        } catch (error) {
            console.error("Error fetching Brat image:", error);
            res.status(500).json({
                status: false,
                error: "Gagal mengambil gambar dari API eksternal."
            });
        }
    });
};