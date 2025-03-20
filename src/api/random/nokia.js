const axios = require('axios');

module.exports = function (app) {
    app.get('/random/nokia', async (req, res) => {
        try {
            const { image, text } = req.query;

            // Cek apakah parameter `image` kosong atau bukan URL valid
            const urlPattern = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
            if (!image || !urlPattern.test(image)) {
                return res.status(400).json({
                    status: false,
                    error: "[ X ] Berikan URL Gambar Bukan Text!"
                });
            }

            let apiURL = `https://api.sycze.my.id/nokia?image=${encodeURIComponent(image)}`;
            if (text) apiURL += `&text=${encodeURIComponent(text)}`;

            const response = await axios.get(apiURL, { responseType: 'arraybuffer' });

            res.setHeader('Content-Type', 'image/png');
            res.send(response.data);
        } catch (error) {
            console.error("Error fetching Nokia image:", error);
            res.status(500).json({
                status: false,
                error: "Gagal mengambil gambar dari API eksternal."
            });
        }
    });
};