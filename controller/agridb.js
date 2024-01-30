const {MongoClient, ObjectId} = require("mongodb")  //used to interact with the mongo database
const dotenv = require('dotenv');  //dotenv is imported to read environment variables from a .env file.
dotenv.config();

const uri = process.env.CONSTR
const client = new MongoClient(uri);
client.connect(); //used to establish a connection to the MongoDB database.



//The function returns the array of Feed retrieved from the database.
async function listFeed(pageNumber, sortOrder, sortDirection, searchStr) {
    const database = client.db('weather');
    const sf = database.collection('sensorfeed');

    const limit = 20;
    const skip = (pageNumber - 1) * limit;

    let sortQuery = {}; //The sortQuery is then used to define the sorting criteria for the MongoDB query.

    var direction = -1 
    if( sortDirection == "A") direction = 1; 

    switch(sortOrder){
        case "title":
            sortQuery = { title: direction };
            break;
        case "year":
            sortQuery = { year: direction };        
            break;
        case "duration":
            sortQuery = { runtime: direction };        
            break;
        case "rating":
            sortQuery = { "imdb.rating": direction };        
            break;
    }

    var options = {sort: sortQuery} 
    var rx = new RegExp(searchStr,"i") 
    var query = {}

    const cursor = sf.find(query, options).limit(limit).skip(skip);
    var outFeed = []
    await cursor.forEach((d,i)=>{
        outFeed.push(d)
    });

    return outFeed
}

async function findMaxHumidityForEachSensor() {

    const database = client.db('weather');
    const sf = database.collection('sensorfeed');
    const result = await sf.aggregate([
    { $group: { _id: "$Sensor_Id", maxHumidity: { $max: "$Humidity" } } }
    ]).toArray();
    console.log(result);
    return result
}

async function findMaxTemperatureForEachSensor() {

    const database = client.db('weather');
    const sf = database.collection('sensorfeed');
    const result = await sf.aggregate([
    { $group: { _id: "$Sensor_Id", maxTemperature: { $max: "$Temperature" } } }
    ]).toArray();
    console.log(result);
    return result
}

async function findAverageTemperatureBySensor() {

    const database = client.db('weather');
    const sf = database.collection('sensorfeed');
    const result = await sf.aggregate([
        { $group: { _id: '$Sensor_Id', avgTemperature: { $avg: '$Temperature' } } }
      ]).toArray();
      console.log(result);
      return result;
    
}

async function findAverageHumidityBySensor() {

    const database = client.db('weather');
    const sf = database.collection('sensorfeed');
    const result = await sf.aggregate([
        { $group: { _id: '$Sensor_Id', avgHumidity: { $avg: '$Humidity' } } }
      ]).toArray();
      console.log(result);
      return result;
    
}


async function ingestFeed(arFeed){
    const database = client.db('weather');
    const sf = database.collection('sensorfeed');

    sf.insertMany(arFeed)
    return true

}


async function clearCollection() {
    const database = client.db('weather');
    const sf = database.collection('sensorfeed');

    sf.deleteMany({})
    return true

}





//return the reading by ID
async function readingByID(id) {

    await client.connect();
    const database = client.db('weather');
    const movies = database.collection('sensorfeed');
    try {
        const query = { _id: new ObjectId(id) };
        const movie = await sf.findOne(query); //double check 
        //await client.close();
        return result
    }
    catch(e){
        return {error:"Incorrect ID"}
    }
}


//update movie 

//async function updateMovie(id, movie) {

//    await client.connect();
//    const database = client.db('sample_mflix');
//    const movies = database.collection('movies');
//    var result = await movies.updateOne({ _id: new ObjectId(id) }, {"$set": movie})
    //await client.close();
//    return result

//}

//delete movie 
//async function deleteMovie(id) {

//    await client.connect();
//    const database = client.db('sample_mflix');
//    const movies = database.collection('movies');
    
//    const query = { _id: new ObjectId(id) };  //find movie based on id
//    const result = await movies.deleteOne(query);
    
    //await client.close();
//    return result


//}

exports.listFeed = listFeed
exports.ingestFeed = ingestFeed
exports.findMaxHumidityForEachSensor = findMaxHumidityForEachSensor
exports.findAverageTemperatureBySensor = findAverageTemperatureBySensor
exports.findMaxTemperatureForEachSensor = findMaxTemperatureForEachSensor
exports.findAverageHumidityBySensor = findAverageHumidityBySensor
exports.clearCollection = clearCollection
exports.readingByID = readingByID
//exports.createMovie = createMovie
//exports.deleteMovie = deleteMovie
//exports.updateMovie = updateMovie
