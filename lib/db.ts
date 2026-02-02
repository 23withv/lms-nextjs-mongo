import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variabel: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const option = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, option)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    client = new MongoClient(uri, option)
    clientPromise = client.connect()
}

export default clientPromise

