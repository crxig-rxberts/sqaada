# Get the server IP
SERVER_IP=$(curl -s http://checkip.amazonaws.com)

export SERVER_IP=$SERVER_IP
export NODE_ENV='production'

# Start the application
node server/index.js