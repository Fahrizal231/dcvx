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

            // Fetch data dari API eksternal
            const response = await axios.get(`https://jazxcode.biz.id/ai/blackbox?query=${encodeURIComponent(query)}`);
            const responseData = response.data;

            console.log("Response from external API:", responseData); // Debugging log

            // Pastikan `responseData.result.response` ada
            if (responseData && responseData.result && responseData.result.response) {
                return res.json({
                    status: true,
                    creator: "👨‍💻 Fahrizal",
                    response: responseData.result.response
                });
            }

            // Jika tidak ada response dari API eksternal
            return res.json({
                status: false,
                creator: "👨‍💻 Fahrizal",
                error: "No valid response from external API."
            });

        } catch (error) {
            console.error("Error fetching Blackbox AI:", error.response ? error.response.data : error.message);
            res.status(500).json({
                status: false,
                error: "Failed to fetch response from Blackbox AI."
            });
        }
    });
};