const { MongoClient, ServerApiVersion } = require('mongodb');
const { DB_URI, DB_NAME } = require('../../env')

const connectDb = async () => {
    const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect();
    return client.db(DB_NAME);
};

exports.connectDb = connectDb;
