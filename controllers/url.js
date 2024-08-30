const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    console.log('Request Body:', body); // Add this line to debug

    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = shortid.generate(); // Corrected this line
    console.log('Generated ShortID:', shortID); // Add this line to debug

    const xyz = {
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    }
    console.log(xyz);
    // await URL.create({
    //     shortId: shortID,
    //     redirectURL: body.url,
    //     visitHistory: [],
    // });

    try {
        await URL.create(xyz);
    } catch (error) {
        console.error('MongoDB Insertion Error:', error);
        return res.status(500).json({ error: 'Database error' });
    }

    return res.render("home",{
        id:shortID,
    })

    // return res.json({ id: shortID });
}

async function handleGetAnalytics(req,res){
    const shortID = req.params.shortId;
    const result = await URL.findOne({shortId:shortID});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

 module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
}