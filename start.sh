# Get the server IP
SERVER_IP=$(curl -s http://checkip.amazonaws.com)

# Export it as an environment variable
export SERVER_IP=$SERVER_IP

# Start the application
node server/index.js