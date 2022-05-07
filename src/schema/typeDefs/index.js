const { gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    type Query {
        myTaskList: [TaskList!]!
        getTaskList(id: ID!): TaskList!
    }

    type Mutation {
        signUp(input: SignUpInput): AuthUser!
        signIn(input: SignInInput): AuthUser!

        createTaskList(title: String!): TaskList!
        updateTaskList(id: ID!, title: String!): TaskList!
        deleteTaskList(id: ID!): Boolean!
        addUserToTaskList(userId: ID!, taskListId: ID!): Boolean!

        createTask(content: String!, taskListId: ID!): Task!
        updateTask(id: ID!, content: String, isCompleted: Boolean): Task!
        deleteTask(id: ID!): Boolean!
    }

    input SignUpInput {
        email: String!
        password: String!
        name: String!
        avatar: String
    }

    input SignInInput {
        email: String!
        password: String!
    }

    type AuthUser {
        user: User!
        token: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        avatar: String
    }

    type Task {
        id: ID!
        content: String!
        isCompleted: Boolean!

        taskList: TaskList!
    }

    type TaskList {
        id: ID!
        createdAt: String!
        title: String!
        progress: Float!

        users: [User!]!
        tasks: [Task!]!
    }
`;

module.exports = typeDefs;