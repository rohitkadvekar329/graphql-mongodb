const { startApolloServer } = require('./schema');
const { MongoClient, ServerApiVersion } = require('mongodb');
const DB_URI = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;

const connectDb = async () => {
    const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect();
    return client.db(DB_NAME);
};

const startServer = async () => {
    const db = await connectDb();
    startApolloServer(db);
}

startServer();
