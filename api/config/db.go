package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/cavdy-play/go_mongo/controllers"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const (
	// Timeout operations after N seconds
	connectTimeout           = 10
	connectionStringTemplate = "mongodb://%s:%s@%s"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
}

// Connect connect
func Connect() {
	username := os.Getenv("MONGODB_USERNAME")
	password := os.Getenv("MONGODB_PASSWORD")
	clusterEndpoint := os.Getenv("MONGODB_ENDPOINT")

	connectionURI := fmt.Sprintf(connectionStringTemplate, username, password, clusterEndpoint)
	// Database Config
	clientOptions := options.Client().ApplyURI(connectionURI)
	client, err := mongo.NewClient(clientOptions)
	//Set up a context required by mongo.Connect
	ctx, cancel := context.WithTimeout(context.Background(), connectTimeout)
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
	db := client.Database("todos")
	controllers.TodoCollection(db)
	return
}
