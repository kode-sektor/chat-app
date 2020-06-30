# Chat-app 

HEROKU LINK : https://whats-a-pp-chat.herokuapp.com/

<hr>

## The aim of this project is build a light-weight real-time chat application using NodeJS, Socket.io and Express

### Milestone 1:
** A few considerations for the app are listed below:

1. Prompt uses for their name before chatting
2. Indicate and manage when a message is in progress
3. Disable sent texts, enable and clear text after it’s confirmed sent/received, error if not
4. Content/styling: my messages vs their messages, time of message, etc

### Milestone 2:
Messages brought to the interface directly from sent/received socket messages are vulnerable if messages are lost in transit, or a user has to reconnect (including the entire history of messages, in the case of a reconnection). Improve the workflow by storing communication in data structures (Arrays and Object). A few things to try:

1. (Server) Store incoming messages to an Array
2. (Server) Relay the entire chat history Array on (re)connection
3. (Front-end) Store the chat Array locally on connection
4. (Server) Each message gets sent individually (ie, not as a complete Array)
5. (Front-end) Store each new message to the local Array
6. (Front-end) Map and join data on the front end, using the Array as the “souce of truth”
