package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/chiatzeheng/src/internal/routes"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load("../../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get the router from the routes package
	router := routes.Router()

	// Middleware function to log requests
	loggedRouter := logRequest(router)

	url := os.Getenv("EXPO_PUBLIC_URL")
	// Create a new HTTP server with the loggedRouter as the handler
	server := http.Server{
		Addr:    url + `:8080`,
		Handler: loggedRouter,
	}

	fmt.Println("Server is running", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request: %s %s", r.Method, r.URL.Path)

		go func() {
			if err := recover(); err != nil {
				log.Printf("Error: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		next.ServeHTTP(w, r)
	})
}
