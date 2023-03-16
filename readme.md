# ToDoX

## Description
This project is a web application built using Angular, Docker, Nginx, and Laravel. It is designed to be easily deployable on any machine that supports Docker.


## Installation
1. Clone the repository from Github.
2. Make sure you have Docker installed on your machine.
3. Create a .env file in the Server directory with the following variables:

TIMEZONE=Europe/Madrid

```
NGINX_PORT=8082
MYSQL_PORT=3382
SERVER_PORT=3000

MYSQL_DATABASE=todox
MYSQL_USER=ps
MYSQL_PASSWORD=cQGMlSMYsUb
```
*Note that you do not need to modify any of the variables in this file unless you want to change the default configuration. Remember that, if you create a new database user, you will need to grant privileges to access.

4. Run docker-compose up -d to start the application. This command will build and start all the necessary Docker containers.
5. You can access the application at http://http://localhost:3000.


## Usage
### Building the application
To build the application, run the following command:
```
docker-compose build
```
This will build all the necessary Docker images.

### Restarting the application
To restart the application, run the following command:
```
docker-compose up -d
```
This will restart all the Docker containers.

### Bringing the application down
To stop the application, run the following command:
```
docker-compose down
```
This will stop and remove all the Docker containers.

### Killing the application
To kill the application, run the following command:
```
docker-compose kill
```
This will stop all the Docker containers immediately.


## Configuration
- The IP addresses are static to make sure that the containers can communicate seamlessly. Please do not modify the IP addresses in the docker-compose.yml file.
- The .env file in the Server directory is already configured with the necessary environment variables. You don't need to modify it unless absolutely necessary.
- The user created in the .env file already has the necessary permissions on the database. You do not need to create another user or modify the permissions of the current user unless a new one is created.


## Using the application
1. To build Docker containers, use the docker-compose up --build -d command.
2. To stop the containers, use the docker-compose down command.
3. To force stop the containers, use the docker-compose kill command.
4. To rebuild the Docker image for a specific application, use the docker-compose build [service name] command.
5. You can access the Angular application via http://http://localhost:3000//.


## Why Docker & Nginx
We use Docker to simplify the process of deploying our application and to ensure consistent environments across all machines. With Docker, we can package all the dependencies and configurations of our application into a single container, making it easy to deploy and run the application on any machine.

We use Nginx as a reverse proxy to handle incoming traffic and distribute it to the appropriate containers in our Docker network. Nginx provides additional features like load balancing, caching, and SSL termination, which can help improve the performance and security of our application.
