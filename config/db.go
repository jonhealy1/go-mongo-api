package config

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"github.com/cavdy-play/go_mongo/controllers"
)

func Connect() {
	// Database Config
	clientOptions := options.Client().ApplyURI("mongodb://sparkgeo:sparkgeo@40.85.223.221:27017/stac?authSource=admin")
	client, err := mongo.NewClient(clientOptions)
	//Set up a context required by mongo.Connect
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	//Cancel context to avoid memory leak
	defer cancel()
	// Ping our db connection
	err = client.Ping(context.Background(), readpref.Primary())
	if err != nil {
		log.Fatal("Couldn't connect to the database", err)
	} else {
		log.Println("Connected!")
	}
	// Connect to the database
	db := client.Database("stac")
	controllers.TodoCollection(db)
	return
}
