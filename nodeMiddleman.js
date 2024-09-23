const net = require("net");
const fs = require("fs");
require("dotenv").config();

// Configuration
const CONTROLLER_IP = process.env.CONTROLLER_IP || "localhost";
const CONTROLLER_PORT = process.env.CONTROLLER_PORT || 23;
// Create a log file stream
const logFile = fs.createWriteStream("connection_logs.txt", { flags: "a" });

//function to set date format
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to log messages to both the console and the file
function logMessage(category, message) {
  const timestamp = formatDate(new Date()); // Use the custom format function
  const log = `[${timestamp}] ${category}: ${message}`;
  console.log(log);
  logFile.write(log + "\n");
}
// Create server to act as middleman

const server = net.createServer((deviceSocket) => {
  logMessage("INFO", "New connection to the server.");

  // Create a client connection to the controller
  const controllerSocket = new net.Socket();

  controllerSocket.connect(CONTROLLER_PORT, CONTROLLER_IP, () => {
    logMessage("INFO", "Client Created.");
  });

  controllerSocket.on("connect", () => {
    logMessage("INFO", "Client Connected.");
  });
  // Forward data from device to controller and log it
  deviceSocket.on("data", (data) => {
    logMessage("Server Logs", `Server recieved data: ${data.toString()}`);
    controllerSocket.write(data);
  });

  // Forward data from controller to device and log it
  controllerSocket.on("data", (data) => {
    logMessage("Client Logs", `Client revieved data: ${data.toString()}`);
    deviceSocket.write(data);
  });

  // Handle device disconnect
  deviceSocket.on("end", () => {
    logMessage("INFO", "Server disconnected.");
    controllerSocket.end();
  });

  // Handle controller disconnect
  controllerSocket.on("end", () => {
    logMessage("INFO", "Client disconnected.");
    deviceSocket.end();
  });

  // Handle errors
  deviceSocket.on("error", (err) => {
    logMessage("Server Logs", `Error: ${err.message}`);
  });
  // Handle connection errors
  controllerSocket.on("error", (err) => {
    logMessage("Client Logs", `Error: ${err.message}`);
    deviceSocket.end();
  });
});

// Start the server
server.listen(3000, () => {
  logMessage("INFO", "Server Created");
});
