const axios = require("axios");

module.exports = function (app) {
  app.get("/random/nokia", async (req, res) => {
    try {
      const { image } = req.query;

      // Jika tidak ada URL gambar, kirim error
      if (!image) {
        return res.status(400).json({
          status: false,
          error: "[ X ] Url Gambar Dibutuhkan, Bukan Text",
        });
      }

      // Validasi apakah input adalah URL
      const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
      if (!urlPattern.test(image)) {
        return res.status(400).json({
          status: false,
          error: "[ X ] Url Gambar Dibutuhkan, Bukan Text",
        });
      }

      // Kirim request ke API eksternal
      const apiURL = `https://api.sycze.my.id/nokia?image=${encodeURIComponent(image)}`;
      console.log("Requesting:", apiURL);

      const response = await axios.get(apiURL, {
        responseType: "arraybuffer", // Mengharapkan gambar sebagai respons
      });

      res.setHeader("Content-Type", "image/png"); // Pastikan tipe gambar
      res.send(response.data); // Kirim gambar langsung

    } catch (error) {
      console.error("Error fetching Nokia image:", error);
      res.status(500).json({
        status: false,
        error: "Gagal mengambil gambar dari API eksternal.",
      });
    }
  });
};