const axios = require('axios');

module.exports = function (app) {
    app.get('/random/nokia', async (req, res) => {
        try {
            const { image } = req.query;

            // Jika tidak ada URL gambar, kembalikan error yang lebih jelas
            if (!image || !image.startsWith("http")) {
                return res.status(400).json({
                    status: false,
                    error: "Harap berikan URL gambar yang valid dengan parameter 'image'. Contoh: /random/nokia?image=https://example.com/image.png"
                });
            }

            const apiURL = `https://api.sycze.my.id/nokia?image=${encodeURIComponent(image)}`;

            const response = await axios.get(apiURL, {
                responseType: 'arraybuffer' // Mengharapkan gambar sebagai respons
            });

            // Ambil Content-Type dari respons API
            const contentType = response.headers["content-type"] || "image/png";

            res.setHeader("Content-Type", contentType);
            res.setHeader("Content-Disposition", 'inline; filename="nokia_image.png"'); // Agar bisa ditampilkan langsung
            res.send(response.data);
        } catch (error) {
            console.error("Error fetching Nokia image:", error.response ? error.response.data : error.message);
            res.status(500).json({
                status: false,
                error: "Gagal mengambil gambar dari API eksternal. Pastikan URL gambar valid."
            });
        }
    });
};