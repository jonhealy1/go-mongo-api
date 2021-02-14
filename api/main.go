package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/cavdy-play/go_mongo/config"
	"github.com/cavdy-play/go_mongo/routes"
)

// https://github.com/cavdy-play/go_mongo/blob/master/config/db.go

func main() {
	// Database
	config.Connect()

	// Init Router
	router := gin.Default()

	// Route Handlers / Endpoints
	routes.Routes(router)

	log.Fatal(router.Run(":4747"))
}
