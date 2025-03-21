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

            console.log("Response from JaxzCode API:", responseData); // Debugging

            // Pastikan responseData memiliki format yang sesuai
            if (!responseData || typeof responseData !== "object" || !responseData.response) {
                return res.status(500).json({
                    status: false,
                    error: "No valid response from external API."
                });
            }

            res.json({
                status: true,
                creator: "👨‍💻 Fahrizal",
                response: responseData.response
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