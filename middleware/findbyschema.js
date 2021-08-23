const multer = require('multer')

const storage = multer.memoryStorage();
const uploadMem = multer({sorage: storage});

const findBySchema(client, nameOfSchema) {
    const result = await client.db("schema_reg").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

module.exports.send = (req, res, next) => {
  return uploadMem.single('file')(req, res, () => {
    // Remember, the middleware will call it's next function
    // so we can inject our controller manually as the next()

    if (!req.file) return res.json({ error: "invalidFiletype" })
    next()
  })
}
