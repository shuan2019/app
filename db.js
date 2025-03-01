import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
    throw new Error('请在.env文件中设置MONGODB_URI环境变量');
}

let client;

export async function connectToDatabase() {
    if (client) {
        return { db: client.db(dbName), client };
    }

    try {
        if (!uri) {
            throw new Error('MongoDB连接URI未设置，请检查环境变量MONGODB_URI');
        }
        if (!dbName) {
            throw new Error('MongoDB数据库名未设置，请检查环境变量MONGODB_DB_NAME');
        }

        client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('成功连接到MongoDB数据库');
        return { db: client.db(dbName), client };
    } catch (error) {
        console.error('连接数据库失败:', error);
        throw new Error(`数据库连接失败: ${error.message}`);
    }
}

export async function getAllApps() {
    const { db } = await connectToDatabase();
    return await db.collection('apps').find({}).toArray();
}

export async function addApp(app) {
    const { db } = await connectToDatabase();
    return await db.collection('apps').insertOne(app);
}

export async function deleteApp(appName) {
    const { db } = await connectToDatabase();
    return await db.collection('apps').deleteOne({ name: appName });
}