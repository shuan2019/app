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
        client = await MongoClient.connect(uri);
        console.log('成功连接到MongoDB数据库');
        return { db: client.db(dbName), client };
    } catch (error) {
        console.error('连接数据库失败:', error);
        throw error;
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