import { Server as NetServer } from "http"
import { NextApiResponseServerIo } from "@/types";
import { Server as ServerIO } from "socket.io"
import { NextApiRequest } from "next";

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = "/api/socket/io"
        const httpServer: NetServer = res.socket.server as any
        const io = new ServerIO(httpServer, {
            path,
            addTrailingSlash: false
        })

        res.socket.server.io = io
    }

    res.end()

}

export default ioHandler