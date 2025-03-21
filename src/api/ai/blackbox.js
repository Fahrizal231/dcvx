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

            // Periksa apakah result ada
            if (responseData && typeof responseData === 'object' && responseData.result) {
                return res.json({
                    status: true,
                    creator: "👨‍💻 Fahrizal",
                    response: responseData.result.response || "No response received."
                });
            }

            // Jika tidak ada `result`, anggap API eksternal gagal
            return res.json({
                status: false,
                creator: "👨‍💻 Fahrizal",
                error: "Invalid response structure from external API."
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