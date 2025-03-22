const axios = require('axios');

module.exports = function(app) {
    async function fetchKhodam(name) {
        try {
            const response = await axios.get(`https://khodam.vercel.app/v2?nama=${encodeURIComponent(name)}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching Khodam data:", error);
            throw error;
        }
    }

    app.get('memek', async (req, res) => {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ status: false, error: "Parameter 'name' wajib diisi" });
            }

            const result = await fetchKhodam(name);
            res.status(200).json({ status: true, result });

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};