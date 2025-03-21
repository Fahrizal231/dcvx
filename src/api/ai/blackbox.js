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
            const responseData = response.data;

            // Ambil hanya 'response' dari API eksternal untuk menghindari duplikasi
            const aiResponse = responseData?.result?.response || "No response received.";

            res.json({
                status: true,
                creator: "👨‍💻 Fahrizal",
                response: aiResponse
            });
        } catch (error) {
            console.error("Error fetching Blackbox AI:", error.message);
            res.status(500).json({
                status: false,
                error: "Failed to fetch response from Blackbox AI."
            });
        }
    });
};