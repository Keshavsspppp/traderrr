import dns from "dns";
import mongoose from "mongoose";

function configureDnsForMongoSrv(uri: string) {
  if (!uri.startsWith("mongodb+srv://")) {
    return;
  }

  // Router/local DNS often refuses SRV lookups for Node's c-ares resolver on Windows.
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }
  return uri;
}

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = getMongoUri();
    configureDnsForMongoSrv(uri);
    cached.promise = mongoose.connect(uri);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}