# ToDoX

## Description
This project is a web application built using Angular, Docker, Nginx, and Laravel. It is designed to be easily deployable on any machine that supports Docker.


## Installation
1. Clone the repository from Github.
2. Make sure you have Docker installed & running on your machine.
3. Create a .env file in the Server directory with the following variables:

    ```
    TIMEZONE=Europe/Madrid

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


## Work with angular
Since we haven't been able to set up angular using Docker, we will be working with angular locally.
1. Once you've build and run all containers, move to the Client directory.
2. Execute ng serve -o (--port xxxx if you want to specify a port, default port is 4200).
3. Angular will be deployed on http://http://localhost:xxxx (http://http://localhost:4200 in case no port was declared).
    * Changes will be updated in Real Time. Make sure to commit and push your changes.
    ** To add elements, just run the command inside the Client directory. E.g. to create a component cd to Client and run ng generate component <component_name>.


## Commit changes as a group member
1. Once you cloned the repository, create a new branch for your feature or bug fix using the following command:
    ```
    git checkout -b <your_branch_name>
    ```
2. Make changes and commit to your branch using the following commands:
    -  When using commit, Git will open your default text editor to allow you to write a multi-line commit message.
        ```
        git commit
        ```
    -  Commit -m option allows you to specify the commit message in-line, without opening a text editor. Useful for quick and simple commit messages.
        ```
        git commit -m "Your commit message"
        ```
3. Push your changes to Github using the following commands:
    ```
    git push origin <your_branch_name>
    ```
**BE AWARE**:
When working with Git, it's important to merge changes from different branches carefully to avoid losing work. The best way to do this is to follow a clear and consistent process for merging. Once your branch has your features, merge those into the main branch (master) when the changes are complete and tested.

To merge changes from a feature branch into the master branch, first ensure that the main branch is up-to-date with the latest changes from other contributors. You can do this by running:
    ```
    git fetch
    ```
and then 
    ```
    git merge origin/master
    ```
Next, switch to the feature branch with
    ```
    git checkout <your_branch_name>
    ```
and merge the changes from the master branch with
    ```
    git merge master
    ```
Resolve any merge conflicts carefully to avoid losing work, and then commit the changes with a descriptive commit message.

The main branch should be used as the stable version of the codebase, and should only contain code that has been thoroughly tested and reviewed. It's important to avoid making changes directly to the main branch, and to only merge changes in from feature branches after they have been reviewed and tested. This helps to ensure that the codebase remains stable and that changes are properly tracked and reviewed.


## Usage
### Building the application
To build the application, run the following command:<br>
    ```
    docker-compose build
    ```<br>
This will build all the necessary Docker images.

### Restarting the application
To restart the application, run the following command:<br>
    ```
    docker-compose up -d
    ```<br>
This will restart all the Docker containers.

### Bringing the application down
To stop the application, run the following command:<br>
    ```
    docker-compose down
    ```<br>
This will stop and remove all the Docker containers.

### Killing the application
To kill the application, run the following command:<br>
    ```
    docker-compose kill
    ```<br>
This will stop all the Docker containers immediately.

### Building with docker-compose up --build -d
To alternatively build the application, run the following command:<br>
    ```
    docker-compose up --build -d
    ```<br>
This command rebuilds the image before starting the container. This command can be slower than docker-compose up -d because it rebuilds the image every time. However, it can be helpful if you have made changes to the Dockerfile or if the image was not built correctly the first time.

## Configuration
- The IP addresses are static to make sure that the containers can communicate seamlessly. Please do not modify the IP addresses in the docker-compose.yml file.
- The .env file in the Server directory is already configured with the necessary environment variables. You don't need to modify it unless absolutely necessary.
- The user created in the .env file already has the necessary permissions on the database. You do not need to create another user or modify the permissions of the current user unless a new one is created.

### Why Docker & Nginx
We use Docker to simplify the process of deploying our application and to ensure consistent environments across all machines. With Docker, we can package all the dependencies and configurations of our application into a single container, making it easy to deploy and run the application on any machine.

We use Nginx as a reverse proxy to handle incoming traffic and distribute it to the appropriate containers in our Docker network. Nginx provides additional features like load balancing, caching, and SSL termination, which can help improve the performance and security of our application.

### Docker folders
Instead of using volumes to store the persistent data for our containers, we have chosen to use a docker folder with the necessary files. The main reason for this is that it can be complicated to execute commands inside a container when the data is stored in a volume.

By having a local folder that we map to containers, we can ensure that data is stored correctly and accessible from any container that needs it. This also makes it easier to manage the data since we don't have to worry about dealing with the volume.

Additionally, by having a local folder for each service (MySQL, PHP, Nginx), we can keep a clear organization of the files and settings of each service. This makes it easier to locate and modify the settings for each service.

For example, we use the hosts.allow file to restrict access to the MySQL service only to specific IP addresses. Similarly, we use the default.conf file to configure the Nginx service to listen on a specific port and handle requests for the Laravel application.


## Basic Docker commands
Here are some basic Docker commands that everyone should know:
- Opens a terminal inside the container with the specified name:
    ```
    docker exec -it <container_name> 
    ```
- Lists all running services defined in the docker-compose file:
    ```
    docker-compose ps
    ```
- List all the Docker networks on the system:
    ```
    docker network ls
    ```
- Remove all unused Docker networks:
    ```
    docker network prune
    ```
- List all running containers:
    ```
    docker ps
    ```
- Display the name of each container and its associated IP address:
    ```
    docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)
    ```
** These are just a few examples of Docker commands. Check the documentation for more information: https://laravel.com/docs/8.x/artisan](https://docs.docker.com/ or https://docs.docker.com/engine/reference/commandline/ (Docker CLI).


## Basic Laravel commands
Here are some basic Laravel commands that everyone should know. Remember to run the commands inside the correct container (todox-app-1).
- Creates a new Eloquent model class:
    ```
    php artisan make:model <model_name>
    ```
- Creates a new controller class:
    ```
    php artisan make:controller <controller_name>
    ```
- Runs all the outstanding database migrations:
    ```
    php artisan migrate
    ```
- Creates a new migration file for a specific table:
    ```
    php artisan make:migration <migration_name> --create=<table_name>
    ```
- Opens an interactive shell to test your application:
    ```
    php artisan tinker
    ```
- Seeds the database with initial data:
    ```
    php artisan db:seed
    ```
- Lists all registered routes:
    ```
    php artisan route:list
    ```
- Caches the configuration files for faster performance
    ```
    php artisan config:cache
    ```
** These are just a few examples of Laravel commands. Check the documentation for more information: https://laravel.com/docs/8.x/artisan


## Using the application
1. To build Docker containers, use the docker-compose up --build -d command.
2. To stop the containers, use the docker-compose down command.
3. To force stop the containers, use the docker-compose kill command.
4. To rebuild the Docker image for a specific application, use the docker-compose build [service name] command.
5. You can access the Angular application via http://http://localhost:3000//.
6. To run commands in a specific container, use the docker exec -it <container_name> to open a terminal inside the container and run the desired command.


## Application Ports:
Front-end application: http://localhost:3000/ <br>
API: http://localhost:8082/


## Custom commands
In addition to the basic Laravel commands, we have added some custom commands to the project. These commands are to be used inside the Laravel container (docker-compose exec php php artisan <command_name> or docker exec -it todox-app-1  -> run <command_name).
- Checks the status of the database connection:
    ```
    php artisan app:checkdb
    ```
