const express = require('express');
const { getInfo } = require('./segrigator');
const router = express.Router();

router.post('/', async (req, res) => {
    const url = req.body.host;  //Get Target Link via request Body
    console.log(url);
    const segrigatedData = await getInfo(url);
    res.send(segrigatedData);
});

module.exports = router;