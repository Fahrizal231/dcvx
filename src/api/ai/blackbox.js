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
            console.log(response.data); // Debugging untuk melihat respons asli dari API eksternal

            if (!response.data || !response.data.result) {
                return res.status(500).json({
                    status: false,
                    error: "Invalid response from Blackbox AI"
                });
            }

            let responseData = response.data;
            responseData.result.creator = "Fahrizal"; // Pastikan creator diubah

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