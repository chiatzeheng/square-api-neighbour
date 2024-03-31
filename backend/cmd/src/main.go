package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"

	"github.com/chiatzeheng/src/internal/routes"
)

func main() {
	// Load environment variables from .env file
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get WD:", err)
	}
	envFilePath := filepath.Join(cwd, "..", "..", "..", ".env")
	err = godotenv.Load(envFilePath)
	if err != nil {
		log.Fatal("Failed to load environment variables:", err)
	}

	// Get the DSN from the environment variable
	dsn := os.Getenv("DSN")
	if dsn == "" {
		log.Fatal("DSN environment variable is not set")
	}

	// Connect to the PostgreSQL database
	ctx := context.Background()
	pool, err := pgxpool.Connect(ctx, dsn)
	if err != nil {
		log.Fatal("failed to connect database", err)
	}
	defer pool.Close()

	// Check if the database connection is working
	var now time.Time
	err = pool.QueryRow(ctx, "SELECT NOW()").Scan(&now)
	if err != nil {
		log.Fatal("failed to execute query", err)
	}

	// Set the database instance in the routes package
	routes.SetDB(pool)

	// Get the router from the routes package
	router := routes.Router()

	// Create a new CORS handler
	url := os.Getenv("EXPO_PUBLIC_URL")

	server := http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	// Start the HTTP server
	fmt.Println("Server is running on", url)
	server.ListenAndServe()
}
