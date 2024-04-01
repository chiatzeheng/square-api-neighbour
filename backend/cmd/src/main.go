package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"

	"github.com/chiatzeheng/src/internal/routes"
)

func printNetworkInfo() {
	ifaces, err := net.Interfaces()
	if err != nil {
		log.Println("Failed to get network interfaces:", err)
		return
	}

	for _, iface := range ifaces {
		addrs, err := iface.Addrs()
		if err != nil {
			log.Printf("Failed to get addresses for interface %s: %v", iface.Name, err)
			continue
		}

		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}

			fmt.Printf("Interface: %s, Address: %s\n", iface.Name, ip)
		}
	}
}

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

	server := http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	fmt.Println("Server is running")
	printNetworkInfo()
	server.ListenAndServe()
}
