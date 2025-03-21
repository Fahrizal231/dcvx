const axios = require('axios');

module.exports = function (app) {
    app.get('/ai/blackbox', async (req, res) => {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    status: false,
                    error: "Query is required"
                });
            }

            const response = await axios.get(`https://jazxcode.biz.id/ai/blackbox?query=${encodeURIComponent(query)}`);
            
            // Pastikan response data sesuai sebelum mengubahnya
            if (response.data && response.data.creator) {
                response.data.creator = "Fahrizal"; // Ubah creator jadi "Fahrizal"
            }

            res.json({
                status: true,
                creator: "👨‍💻 Fahrizal",
                result: response.data
            });
        } catch (error) {
            console.error("Error fetching Blackbox AI:", error);
            res.status(500).json({
                status: false,
                error: "Failed to fetch response from Blackbox AI."
            });
        }
    });
};