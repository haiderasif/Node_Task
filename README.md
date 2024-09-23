# Node_Task
To run this code the first step is to open terminal and write "nc -l 23". What this command does is it listens to port 23 and if there is a connection that is trying to connect to port 23 it connects to it. 

The next step is to run the node script by writing "node nodeMiddleman" in the same directory where code is.

Next step is to create a connection between server and the client. 

open another terminal and write telnet localhost 3000. This terminal will act as a device that is trying to connect to a client. When this device connects to the server on port 3000 the server connects this device to the client on port 23 that we started in the beginning. 

The device is started on different port to handle errors more efficiently. 

If you keep the server and the client on the same port which is default telnet port 23 then you need to make sure you are listening to port 23 before starting the server and connecting to it. 

If you are not running "nc -l 23" before starting the server and device is also running on the same port 23 instead of 3000 then the server will keep trying to reconnect to itself thinking it is the client and it will cause an infinite loop. 
