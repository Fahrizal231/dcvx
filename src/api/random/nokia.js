const axios = require("axios");

module.exports = function (app) {
    app.get("/random/nokia", async (req, res) => {
        try {
            const { image } = req.query;

            // Cek apakah parameter "image" ada dan merupakan URL gambar yang valid
            if (!image || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i.test(image)) {
                return res.status(400).json({
                    status: false,
                    error: "[ X ] Berikan URL Gambar Dibutuhkan!"
                });
            }

            const apiURL = `https://api.sycze.my.id/nokia?image=${encodeURIComponent(image)}`;

            const response = await axios.get(apiURL, {
                responseType: "arraybuffer",
            });

            res.setHeader("Content-Type", "image/png");
            res.send(response.data);
        } catch (error) {
            console.error("Error fetching Nokia image:", error.response ? error.response.data : error.message);

            res.status(500).json({
                status: false,
                error: "[ X ] Gagal mengambil gambar dari API eksternal!"
            });
        }
    });
};