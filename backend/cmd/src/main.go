// main.go

package main

import (
	"log"
	"os"

	"github.com/chiatzeheng/src/internal/routes" // Import your routes package
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	load := godotenv.Load()
	if load != nil {
		log.Fatal("failed to load env", load)
	}

	// Connect to PlanetScale database using DSN environment variable.
	db, err := gorm.Open(mysql.Open(os.Getenv("DSN")), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatalf("failed to connect to PlanetScale: %v", err)
	}

	// Set the db in the routes package
	routes.SetDB(db)

	// Get the router and run the server
	r := routes.Router()
	r.Run(":8080")
}
