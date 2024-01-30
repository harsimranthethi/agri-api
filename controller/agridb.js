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





//return the movie by ID
async function movieByID(id) {

    await client.connect();
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    try {
        const query = { _id: new ObjectId(id) };
        const movie = await movies.findOne(query);
        //await client.close();
        return movie
    }
    catch(e){
        return {error:"Incorrect ID"}
    }
}

//new movie 
async function createMovie(newmovie) {

    await client.connect();
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    
    // Insert the new movie into the 'movies' collection
    const result = await movies.insertOne(newmovie);
    console.log(result)
    //await client.close();
    return result;

}

//update movie 

async function updateMovie(id, movie) {

    await client.connect();
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    var result = await movies.updateOne({ _id: new ObjectId(id) }, {"$set": movie})
    //await client.close();
    return result

}

//delete movie 
async function deleteMovie(id) {

    await client.connect();
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    
    const query = { _id: new ObjectId(id) };  //find movie based on id
    const result = await movies.deleteOne(query);
    
    //await client.close();
    return result


}

exports.listFeed = listFeed
exports.ingestFeed = ingestFeed
exports.findMaxHumidityForEachSensor = findMaxHumidityForEachSensor
exports.clearCollection = clearCollection
exports.movieByID = movieByID
exports.createMovie = createMovie
exports.deleteMovie = deleteMovie
exports.updateMovie = updateMovie
