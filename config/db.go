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

const (
	// Timeout operations after N seconds
	connectTimeout           = 5
	connectionStringTemplate = "mongodb://%s:%s@%s"
)

// Connect connect
func Connect() {
	// username := os.Getenv("MONGODB_USERNAME")
	// password := os.Getenv("MONGODB_PASSWORD")
	//clusterEndpoint := os.Getenv("MONGODB_ENDPOINT")

	//connectionURI := fmt.Sprintf(connectionStringTemplate, username, password, clusterEndpoint)
	// Database Config
	clientOptions := options.Client().ApplyURI("mongodb://user:user@mongo:27017")
	// clientOptions := options.Client().ApplyURI(connectionURI)
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
	db := client.Database("todos")
	controllers.TodoCollection(db)
	return
}
