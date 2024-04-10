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

	// Middleware function to log requests
	loggedRouter := logRequest(router)

	url := os.Getenv("EXPO_PUBLIC_URL")
	uri := url + `:8080`

	// Create a new HTTP server with the loggedRouter as the handler
	server := http.Server{
		Addr:    uri,
		Handler: loggedRouter,
	}
	fmt.Println("Server is running", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

// Middleware function to log requests
// Middleware function to log requests and errors
func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Log the request method and URL
		log.Printf("Request: %s %s", r.Method, r.URL.Path)

		// Call the next handler and catch any errors
		defer func() {
			if err := recover(); err != nil {
				// Log the error message
				log.Printf("Error: %v", err)
				// Return a 500 Internal Server Error to the client
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}
