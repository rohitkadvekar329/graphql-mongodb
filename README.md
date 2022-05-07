The purpose of this project is to learn about GraphQL. It is a simple task management application with authentication. 

###  Tech stack
Nodejs, GraphQL, MongoDB. JWT.

## Usage
1. Initialize a .env file. <br />
Example .env file:
```
DB_URI="MONGO_DB_URL"
DB_NAME="EXAMPLE_DB"
JWT_SECRET="JWT SECRET"
```
3. Start server:
```
yarn dev
```
4. `signUp` method will return a jwt token. This token should be added to HTTP Authorization Header before calling other methods. 

## Query Methods 
```
myTaskList:[TaskList!]!

getTaskList(…):TaskList!
```
## Mutation Methods 
```
signUp(…):AuthUser!

signIn(…):AuthUser!

createTaskList(…):TaskList!

updateTaskList(…):TaskList!

deleteTaskList(…):Boolean!

addUserToTaskList(…):Boolean!

createTask(…):Task!

updateTask(…):Task!

deleteTask(…):Boolean!
```

