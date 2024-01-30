var express= require("express")
var router = express.Router();
var mdb = require("../../controller/agridb")

router.get("/list", async function(req,res,next){
    var page = 1
    var sort = "alpha"
    var direction
    var searchStr = ""
    if (req.query.page != undefined) page = req.query.page;
    if (req.query.sort != undefined) sort = req.query.sort;
    if (req.query.direction != undefined) direction = req.query.direction;
    if (req.query.searchStr != undefined) searchStr = req.query.searchStr;
    res.send(await mdb.listFeed(page, sort,direction, searchStr)) 

})

//sf/ingest
router.get("/clear", async function(req,res,next){
    var mobj = await mdb.clearCollection()
    res.send({status: mobj})
})

//sf/ingest
router.post("/ingest", async function(req,res,next){
    var mobj = await mdb.ingestFeed(req.body)
    res.send({status: mobj})
})

//sf/ingest
router.post("/ingestcsv", express.raw({ type: '*/*' }), async function(req,res,next){
    var csv = require("csvtojson")
    console.log(req.body.toString())
    csv().fromString(req.body.toString()).then(async j=>{
        console.log(j)
        var mobj = await mdb.ingestFeed(j)
        res.send({status: mobj})
    })
})

module.exports = router


