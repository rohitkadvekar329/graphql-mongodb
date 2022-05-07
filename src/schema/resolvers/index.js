const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { JWT_SECRET } = require('../../env')

function getToken(user) {
    if (!user || !user._id) {
        throw new Error('Invalid user for token generation');
    }
    return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7 days' });
}

// Resolvers define the technique for fetching the types defined in the schema.
const resolvers = {
    Query: {
        myTaskList: async (parent, args, context) => {
            const { user, db } = context;
            if (!user || !db) {
                throw new Error('Can not find the user for task list');
            }
            const taskListCursor = await db.collection('TaskList').find({ userIds: user._id });
            return taskListCursor.toArray();
        },
        getTaskList: async (parent, args, context) => {
            const {id} = args;
            const {user, db} = context;
            if (!user || !db) {
                throw new Error('Can not find the user for task list');
            }
            try {
                const taskList = await db.collection('TaskList').findOne({ _id: ObjectId(id) });
                if (!taskList) {
                    throw new Error('No record found.')
                }
                return taskList;
            } catch(e) {
                console.error(e);
                throw new Error("Invalid task list id.");
            }
        }
    },
    Mutation: {
        signUp: async (parent, args, context, info) => {
            const { input } = args;
            const { db } = context;
            const userTable = db.collection('User');
            const hashedPass = bcrypt.hashSync(input.password);
            const user = {
                ...input,
                password: hashedPass,
            }
            const result = await userTable.insertOne(user);
            const dbUser = await userTable.findOne(result.insertedId)
            
            return {
                user: dbUser,
                token: getToken(dbUser)
            }
        },
        signIn: async (parent, args, context, info) => {
            const { input } = args;
            const { db } = context;
            const userTable = db.collection('User');
            const dbUser = await userTable.findOne({ email: input.email }) // email unique field
            if (!dbUser) {
                throw new Error('Invalid credentials!');
            }
            const isPasswordCorrect = bcrypt.compareSync(input.password, dbUser.password);
            if (!isPasswordCorrect) {
                throw new Error('Invalid credentials!');
            }
            return {
                user: dbUser,
                token: getToken(dbUser)
            }
        },
        createTaskList: async (parent, args, context, info) => {
            const { title } = args
            const { db, user } = context;
            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }
            if (!title || !db) {
                throw new Error('Tasks could not created');
            }
            
            const taskListTable = db.collection('TaskList');
            const newTaskList = {
                title,
                createdAt: new Date().toISOString(),
                userIds: [user._id]
            };
            const result = await taskListTable.insertOne(newTaskList);
            const dbTaskList = await taskListTable.findOne(result.insertedId);
            
            return dbTaskList;
        },
        updateTaskList: async (parent, args, context, info) => {
            const { id, title } = args;
            const { user, db } = context;
            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }
            const taskListTable = await db.collection('TaskList');
            const result = await taskListTable.updateOne(
                {_id: ObjectId(id)},
                { $set: 
                    {
                        title
                    }
                }
            )
            return await taskListTable.findOne({ _id: ObjectId(id) });
        },
        deleteTaskList: async (parent, args, context, info) => {
            const { id } = args;
            const { user, db } = context;
            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }
            const taskListTable = db.collection('TaskList');
            let canDelete = false;

            const taskList = await taskListTable.findOne({ _id: ObjectId(id) });
            taskList && taskList.userIds.forEach((collabratorId) => {
                if (collabratorId.equals(user._id)) {
                    canDelete = true;
                }
            })
            if (canDelete) {
                const result = await taskListTable.deleteOne({ _id: ObjectId(id) })
                return result.deletedCount === 1;
            } else {
                throw new Error('Only collabrators can delete task list.')
            }
        },
        addUserToTaskList: async (parent, args, context, info) => {
            const { userId, taskListId } = args;
            const { user, db } = context;
            const taskListTable = db.collection('TaskList');
            const userIdObj = ObjectId(userId);
            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }
            const taskList = await resolvers.Query.getTaskList(null, {id: taskListId}, context);
            taskList.userIds.forEach((id) => {
                if (id.equals(userIdObj)) {
                    throw new Error('Given user already added as collaborator.');
                }
            })
            const result = await taskListTable.updateOne(
                { _id: ObjectId(taskListId) },
                {$push: { userIds: userIdObj }}
            );
            return result.modifiedCount === 1;
        },

        createTask: async (parent, args, context, info) => {
            const { user, db } = context;
            const {content, taskListId} = args;
            const taskTable = db.collection('Task');

            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }
            const newTask = {
                content,
                taskListId,
                isCompleted: false,
            };
            const result = await taskTable.insertOne(newTask);
            const task = await taskTable.findOne(result.insertedId);
            return task;
        },
        updateTask: async (parent, args, context, info) => {
            const {id, content, isCompleted} = args;
            const {db, user} = context;
            const taskTable = db.collection('Task');
            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }
            const updatedTask = {};
            if (content !== null && content !== undefined) {
                updatedTask.content = content;
            }
            if (isCompleted !== null && isCompleted !== undefined) {
                updatedTask.isCompleted = isCompleted;
            }

            const result = await taskTable.updateOne(
                { _id: ObjectId(id) },
                { $set: updatedTask }
            )
            return await taskTable.findOne(ObjectId(id));
        },
        deleteTask: async (parent, args, context, info) => {
            const { id } = args;
            const { db, user } = context;
            if (!user) {
                throw new Error('Auth error. Please sign in.');
            }

            const result = await db.collection('Task').deleteOne({ _id: ObjectId(id) });
            return result.deletedCount === 1;
        }
    },
    User: {
        id: (parent) => parent._id || parent.id
    },
    Task: {
        id: (parent) => parent._id || parent.id,
        taskList: async (parent, _, context) => {
            const {db} = context;
            return await db.collection('TaskList').findOne(ObjectId(parent.taskListId));
        }
    },
    TaskList: {
        id: (parent, _, context) => parent._id || parent.id,
        users: async (parent, _, context) => {
            const ids = parent.userIds;
            const db = context.db;
            return Promise.all(ids.map((id) => db.collection('User').findOne({ _id: id })))
        },
        progress: async (parent, _, context) => {
            const tasks = await resolvers.TaskList.tasks(parent, _, context);
            if (!tasks || tasks.length == 0) {
                return 0;
            }

            let completed = 0;
            for (task of tasks) {
                if (task.isCompleted) {
                    completed += 1
                }
            }
            return Math.floor((completed / tasks.length) * 100);
        },
        tasks: async (parent, _, context) => {
            const {_id} = parent;
            const {db} = context;
            const result = await db.collection('Task').find({ taskListId: _id.toString() });
            return await result.toArray();
        }
    }
};

module.exports = resolvers;