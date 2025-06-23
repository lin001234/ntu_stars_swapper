# ntu_stars_swapper
A website that allow for easier and simplier swapping of index between individuals, as well as chat with each other.

## To run Docker Container in Development

We have both docker-compose as well as Dockerfile, where the dockerfile build the Docker image and docker-compose.yml is a config file that specify how the images should be run

### Basic docker-compose commands

1. Build and Start (-d for detached)
```
docker-compose up --build 
```
2. Rebuild specific service
```
docker-compose build ${service}
```
3. Stop the services
```
docker-compose down
```
4. Stop and remove everything
```
docker-compose down -v
```
5. Restart service
```
docker-compose restart ${specific service if needed}
```
6. View Logs
```
docker-compose logs -f ${specific service if needed}
```
7. Access backend container shell
```
docker-compose exec backend sh
```
8. Start and stop containers without rebuilding
```
docker-compose start
docker-compose stop
```

### To run the docker-compose file 
1. Start Docker Desktop application

2. Run docker-compose file on terminal
```
docker-compose up --build 
```

