import app from "../app.ts";
import http from "http";
import { AddressInfo } from "net";
import { createHttpTerminator } from "http-terminator";
import {GraphSingleton} from "../GraphSingleton.ts";

console.info("Connecting to database...");
try {
    require("./database-connection.ts");
    console.log("Successfully connected to the database");
} catch (error) {
    console.error(`Unable to establish database connection:
  ${error}`);
    process.exit(1);
}

const port: string | undefined = process.env.PORT;
if (port === undefined) {
    console.error("Failed to start: Missing PORT environment variable");
    process.exit(1);
}
app.set("port", port);

console.info("Starting server...");
const server: http.Server = http.createServer(app);
export default server;

[
    "SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP",
    "SIGABRT", "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV",
    "SIGUSR2", "SIGTERM",
].forEach(function(sig) {
    process.on(sig, async function() {
        console.info(`Server shutting down due to ${sig}...`);
        const httpTerminator = createHttpTerminator({ server, gracefulTerminationTimeout: 10 });
        await httpTerminator.terminate();
        console.log("Server shutdown complete");
        process.exit(0);
    });
});

// Initialize the graph before starting the server
async function initializeGraphAndStartServer() {
    try {
        console.info("Initializing the graph...");
        await GraphSingleton.getInstance();
        console.info("Graph successfully initialized");
        server.listen(port);
        server.on("error", onError);
        server.on("listening", onListening);

    } catch (error) {
        console.error(`Graph initialization failed: ${error}`);
        process.exit(1);
    }
}

initializeGraphAndStartServer()
    .then(() => console.log('Graph initialized and server started successfully.'))
    .catch((error) => {
        console.error('Failed to initialize graph or start server:', error);
        process.exit(1); 
    });

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind: string = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated permissions`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            console.error(`Failed to start: ${error}`);
            process.exit(1);
    }
}

function onListening(): void {
    const addr: string | AddressInfo | null = server.address();
    const bind: string = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
    console.info("Server listening on " + bind);
    console.log("Startup complete");
}
