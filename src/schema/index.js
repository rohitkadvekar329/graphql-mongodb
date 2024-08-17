const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');


const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');


const JWT_SECRET = process.env.JWT_SECRET;
async function startApolloServer(db){
    const context = async ({ req }) => {
        // const user = await getUserFromToken(req.headers.authorization, db);
        return {
            db,
            // user,
        }
    }

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers, 
        context,
    });

    // The `listen` method launches a web server.
    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    })
}

async function getUserFromToken(token, db) {
    if (!token || !db) {
        return null;
    }
    const tokenData = jwt.verify(token, JWT_SECRET);
    if (!tokenData || !tokenData.id) {
        return null;
    }
    return await db.collection('User').findOne({ _id: ObjectId(tokenData.id) });
}

exports.startApolloServer = startApolloServer;