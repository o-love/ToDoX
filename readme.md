# ToDoX - Task Management Application
ToDoX is a powerful task management web application built using Angular and Laravel. It aims to provide users with an intuitive interface to manage tasks and projects efficiently. With a combination of Docker, Nginx, and Laravel, this project is designed for easy deployment on various platforms.

**Please Note: This project is developed solely for a university project. It is an unfinished task management web application.**

## Table of Contents
- [Introduction](#introduction)
- [Prototypes](#prototypes)
  - [Sheppy the Explorer](#sheppy-the-explorer)
  - [Target Shooting](#target-shooting)
  - [AI Art Proposal](#ai-art-proposal)
- [Getting Started](#getting-started)
- [Acknowledgments](#acknowledgments)

## Description
ToDoX is a collaborative task management application that enables teams to organize, track, and prioritize tasks. It combines the capabilities of Angular and Laravel to provide a seamless user experience. Docker and Nginx are utilized to ensure smooth deployment across different environments.

## Dependencies
To use this project, ensure you have Docker installed and running on your system.

## Getting Started
To get started with the project, follow these steps:

### Setting up Laravel
1. Clone the repository:
   ```bash
   https://github.com/mele13/ToDoX.git
   ```
   ```bash
   cd ToDoX
   ```
3. Make sure you have Docker installed & running on your machine.
3. Create a .env file on the root directory with the following variables:
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

3. Copy the .env.example file in the Server directory, rename it .env and modify the following variables:
    ```
    DB_CONNECTION=mysql
    DB_HOST=172.16.0.3
    DB_PORT=3306
    DB_DATABASE=todox
    DB_USERNAME=ps
    DB_PASSWORD='cQGMlSMYsUb'
    ```
6. Build and start all the containers using the following command. For more information, check the 'Basic Docker commands' section.
    ```bash
    docker-compose up --build -d
    ```
6. Follow the additional steps in the 'Setting up Angular' section below.

### Setting up Angular
Although Angular is not set up using Docker, you can work with Angular locally:
1. After starting all containers, navigate to the Client directory:
    ```bash
   cd Client
   ```
2. Execute ng serve -o (--port xxxx if you want to specify a port, default port is 4200).
3. Angular will be deployed on http://http://localhost:xxxx (http://http://localhost:4200 in case no port was declared).
    * Changes will be updated in Real Time. Make sure to commit and push your changes.
    ** To add elements, just run the command inside the Client directory. E.g. to create a component cd to Client and run ng generate component <component_name>.
4. Follow the additional steps in the 'Database migrations' section below.

### Database migrations
To be up to date with all the database migrations, execute the following commands:
1. Access the Laravel container: 
    ```bash
    docker exec -it todox-app-1 bash
    ```
2. Run migrations to create all the tables of the database:
    ```bash
    php artisan migrate
    ```
3. Seed the database to create 3 basic States:
    ```bash
    php artisan db:seed --class=StateSeeder
    ```

## Commit Changes as a Group Member
Follow these steps to commit changes as a group member:
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

## Basic Docker commands
Here are some basic Docker commands that everyone should know:
- Build all the necessary Docker images:
    ```
    docker-compose build
    ```
- (Re)Start all the Docker containers:
    ```
    docker-compose up -d
    ```
- Rebuild the image before starting the container:
    ```
    docker-compose up --build -d
    ```
    This command can be slower than docker-compose up -d because it rebuilds the image every time. However, it can be helpful if you have made changes to the Dockerfile or if the image was not built correctly the first time.
- Stop the application and remove all the Docker containers:
    ```
    docker-compose down
    ```
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
- Stop all the Docker containers immediately:
    ```
    docker-compose kill
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

## Configuration
- IP addresses are static to ensure seamless communication between containers.
- Modify the .env files as necessary.
- The Docker folders structure helps manage settings and data efficiently.

## Why Docker & Nginx
- Docker simplifies deployment and ensures consistent environments.
- Nginx acts as a reverse proxy, improving performance and security.

## Docker Folders
Using Docker folders instead of volumes simplifies data management and access inside containers.

## Application Ports:
- Front-end application: http://localhost:4200/ (or http://localhost:<port_number>/ if you've used a different port)
- API: http://localhost:8082/

## Custom commands
In addition to the basic Laravel commands, we have added some custom commands to the project. These commands are to be used inside the Laravel container (docker-compose exec php php artisan <command_name> or docker exec -it todox-app-1  -> run <command_name>).
- Checks the status of the database connection:
    ```bash
    php artisan app:checkdb
    ```

## Contributing
Contributions to this project are welcome! If you have suggestions, find bugs, or want to add new features, please follow these steps:

Fork the repository.
Create a new branch: git checkout -b feature/your-feature-name
Make your changes and test thoroughly.
Commit your changes: git commit -m 'Add feature: your feature name'
Push to the branch: git push origin feature/your-feature-name
Create a pull request explaining your changes.

Enjoy exploring the project!

## Disclaimer
This project is developed exclusively for educational purposes as part of a university project. 

--------------------------------------------------

Feel free to explore, learn, and have fun with this project! If you have any questions or suggestions, please open an issue on this repository.

