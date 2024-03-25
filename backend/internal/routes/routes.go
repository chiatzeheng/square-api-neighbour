package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"

	_ "github.com/lib/pq"
)

var db *pgxpool.Pool

// SetDB sets the database connection for the routes
func SetDB(database *pgxpool.Pool) {
	db = database
}

func Router() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/getProducts", getProducts)
	mux.HandleFunc("/fetchBusinesses", fetchBusinesses)
	mux.HandleFunc("/fetchLocations", fetchLocations)
	mux.HandleFunc("/", lol)
	return mux
}

func lol(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/")
	json.NewEncoder(w).Encode("hello")
}

// getProducts handles the GET request to fetch products
func getProducts(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Execute the query with a context
	rows, err := db.Query(context.Background(), "SELECT ProductID, Name, Description, Price, Category, BusinessID, IsVirtual FROM Product")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ProductID, &p.Name, &p.Description, &p.Price, &p.Category, &p.BusinessID, &p.IsVirtual)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	// Convert the products to JSON and send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func fetchBusinesses(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Fetch businesses from the database
	rows, err := db.Query(context.Background(), `SELECT "BusinessID", "Name", "Description", "Category", "SquareAccountID" FROM "defaultdb"."Business";`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var businesses []Business
	for rows.Next() {
		var b Business
		err := rows.Scan(&b.BusinessID, &b.Name, &b.Description, &b.Category, &b.SquareAccountID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		businesses = append(businesses, b)
	}

	// Convert the businesses to JSON and send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(businesses)
}

func fetchLocations(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."Location";`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var location []Location
	for rows.Next() {
		var l Location
		err := rows.Scan(&l.LocationID, &l.Latitude, &l.Longitude, &l.LatitudeDelta, &l.LongitudeDelta)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		location = append(location, l)
	}

	// Convert the businesses to JSON and send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(location)

}

// Define the Product struct

type User struct {
	UserID int    `json:"userID"`
	Name   string `json:"name"`
	Email  string `json:"email"`
	// Add additional user fields as needed
}

type Business struct {
	BusinessID      int    `json:"businessID"`
	Name            string `json:"name"`
	Description     string `json:"description"`
	Category        string `json:"category"`
	SquareAccountID string `json:"squareAccountID"`
}

type Location struct {
	LocationID     int     `json:"locationID"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	LatitudeDelta  float64 `json:"latitudeDelta"`
	LongitudeDelta float64 `json:"longitudeDelta"`
}

type AR struct {
	ARID        int       `json:"arID"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	CreatorID   int       `json:"creatorID"`
	CreatedDate time.Time `json:"createdDate"`
}

type ARExperienceData struct {
	ARID  int    `json:"arID"`
	Key   string `json:"key"`
	Value string `json:"value"`
}

type ARBusiness struct {
	ARID       int `json:"arID"`
	BusinessID int `json:"businessID"`
}

type Product struct {
	ProductID   int     `json:"productID"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	BusinessID  int     `json:"businessID"`
	IsVirtual   bool    `json:"isVirtual"`
}

type Transaction struct {
	TransactionID   int       `json:"transactionID"`
	UserID          int       `json:"userID"`
	ProductID       int       `json:"productID"`
	TransactionDate time.Time `json:"transactionDate"`
	Amount          float64   `json:"amount"`
	PaymentMethod   string    `json:"paymentMethod"`
	SquarePaymentID string    `json:"squarePaymentID"`
}

type TransactionBusiness struct {
	TransactionID int `json:"transactionID"`
	BusinessID    int `json:"businessID"`
}

type Content struct {
	ContentID   int       `json:"contentID"`
	ContentType string    `json:"contentType"`
	UserID      int       `json:"userID"`
	BusinessID  int       `json:"businessID"`
	Content     string    `json:"content"`
	CreatedDate time.Time `json:"createdDate"`
}
