const { connectDb } = require('./db/connection');
const { startApolloServer } = require('./schema');

const startServer = async () => {
    const db = await connectDb();
    startApolloServer(db);
}

startServer();
