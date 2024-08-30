const express = require("express");
const path = require("path");
const app = express();
const PORT = 8001;
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const staticRoute = require("./routes/staticRouter");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/url", urlRoute);
app.use("/", staticRoute);

app.set("view engine", "ejs");
app.set('views',path.resolve("./views"));

app.get("/test",async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render("home",{
        urls:allUrls,
    });
})
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        },
        { new: true } // This option ensures the updated document is returned
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectURL);
});


connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDb Connected"));

app.listen(PORT, () => console.log("Server: 8001"));
