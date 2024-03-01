// main.go

package main

import (
	"log"
	"os"

	"database/sql"

	"github.com/chiatzeheng/src/internal/routes" // Import your routes package
	"github.com/joho/godotenv"
)

func main() {
	load := godotenv.Load()
	if load != nil {
		log.Fatal("failed to load env", load)
	}

	// Open a connection to the database
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		log.Fatal("failed to open db connection", err)
	}

	// Check if the connection is alive
	if err = db.Ping(); err != nil {
		log.Fatal("failed to ping db", err)
	}

	// Set the db in the routes package
	routes.SetDB(db)

	// Get the router and run the server
	r := routes.Router()
	r.Run(":8080")
}
