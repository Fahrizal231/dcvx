const axios = require('axios');

module.exports = function (app) {
    app.get('/random/nokia', async (req, res) => {
        try {
            const { image } = req.query;

            // Jika tidak ada URL gambar, kembalikan error
            if (!image) {
                return res.status(400).json({
                    status: false,
                    error: "Berikan URL gambar untuk diproses."
                });
            }

            const apiURL = `https://api.sycze.my.id/nokia?image=${encodeURIComponent(image)}`;

            const response = await axios.get(apiURL, {
                responseType: 'arraybuffer' // Mengharapkan gambar sebagai respons
            });

            res.setHeader('Content-Type', 'image/png'); // Pastikan tipe gambar
            res.send(response.data); // Kirim gambar langsung
        } catch (error) {
            console.error("Error fetching Nokia image:", error);
            res.status(500).json({
                status: false,
                error: "Gagal mengambil gambar dari API eksternal."
            });
        }
    });
};