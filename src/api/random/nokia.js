const axios = require("axios");

module.exports = function (app) {
    app.get("/random/nokia", async (req, res) => {
        try {
            const { image } = req.query;

            // Validasi URL gambar
            if (!image || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i.test(image)) {
                return res.status(400).json({
                    status: false,
                    error: "[ X ] Berikan URL Gambar Bukan Text!"
                });
            }

            const apiURL = `https://api.sycze.my.id/nokia?image=${encodeURIComponent(image)}`;

            // Coba ambil gambar dari API eksternal
            const response = await axios.get(apiURL, {
                responseType: "arraybuffer",
            });

            // Pastikan API tidak mengembalikan error dalam bentuk JSON
            if (response.headers["content-type"] !== "image/png") {
                return res.status(400).json({
                    status: false,
                    error: "[ X ] API eksternal mengembalikan respons yang salah.",
                    response: response.data.toString(), // Tambahkan debugging
                });
            }

            // Set header & kirim gambar ke user
            res.setHeader("Content-Type", "image/png");
            res.send(response.data);
        } catch (error) {
            console.error("Error fetching Nokia image:", error.response ? error.response.data : error.message);
            res.status(500).json({
                status: false,
                error: `Gagal mengambil gambar: ${error.response ? error.response.data : error.message}`,
            });
        }
    });
};