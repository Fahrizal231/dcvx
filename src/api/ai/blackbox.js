const axios = require('axios');

module.exports = function (app) {
    async function blackboxAI(query) {
        const { data } = await axios.get(`https://jazxcode.biz.id/ai/blackbox?query=${encodeURIComponent(query)}`);
        return data;
    }

    app.get('/ai/blackbox', async (req, res) => {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    status: false,
                    error: "Query is required"
                });
            }

            const result = await blackboxAI(query);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: "Failed to fetch response from Blackbox AI"
            });
        }
    });
};