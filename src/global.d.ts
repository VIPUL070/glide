import { Connection } from "mongoose";

declare global {
    var glideConn:{
        conn: Connection | null,
        promise: Promise<Connection> | null
    }
}

export {}