build:			## Build api & db containers
	docker-compose build

run:			## Run api & db containers
	docker-compose up

refresh:		## Build and run api & db containers
	docker-compose build && docker-compose up