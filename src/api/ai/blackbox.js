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
            let responseData = response.data;

            // Pastikan result ada sebelum mengubahnya
            if (responseData.result && responseData.result.creator) {
                responseData.result.creator = "Fahrizal"; // Ubah creator di dalam result
            }

            res.json({
                status: true,
                creator: "👨‍💻 Fahrizal",
                result: responseData.result
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