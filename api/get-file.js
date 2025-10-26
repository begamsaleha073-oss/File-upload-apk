// api/get-file.js
module.exports = async (req, res) => {
    // CORS allow kare
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { fileId } = req.query;

    try {
        // Yahan aapka bot integration hoga
        // Example: Telegram bot se file URL le
        const fileUrl = await getTelegramFileUrl(fileId);
        
        res.json({
            success: true,
            downloadUrl: fileUrl
        });
    } catch (error) {
        res.json({
            success: false,
            error: error.message
        });
    }
};

// Telegram bot se file URL le
async function getTelegramFileUrl(fileId) {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    
    // Step 1: File info le
    const fileInfoResponse = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileInfo = await fileInfoResponse.json();
    
    // Step 2: Download URL banaye
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.result.file_path}`;
    
    return downloadUrl;
}
