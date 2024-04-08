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
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("hello")) })
	mux.HandleFunc("GET /getProducts", getProducts)
	mux.HandleFunc("GET /fetchBusinesses", fetchBusinesses)
	mux.HandleFunc("GET /fetchLocations", fetchBL)
	return mux
}

// getProducts handles the GET request to fetch products
func getProducts(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Execute the query with a context
	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."product"; `)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ProductID, &p.Name, &p.Description, &p.Price, &p.Category, &p.BusinessID, &p.Image)
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
	rows, err := db.Query(context.Background(), `SELECT "businessid", "name", "image", "description", "category" FROM "defaultdb"."Business";`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var businesses []Business
	for rows.Next() {
		var b Business
		err := rows.Scan(&b.BusinessID, &b.Name, &b.Image, &b.Description, &b.Category)
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

func fetchBL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."Location" l JOIN "defaultdb"."Business" b ON b."businessid" = l."locationid";`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type BusinessLocation struct {
		Location
		Business
	}

	var businessLocations []BusinessLocation

	for rows.Next() {
		var bl BusinessLocation
		var l Location
		var b Business
		err := rows.Scan(&l.LocationID, &l.Latitude, &l.Longitude, &l.LatitudeDelta, &l.LongitudeDelta, &b.BusinessID, &b.Image, &b.Name, &b.Description, &b.Category)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		bl.Location = l
		bl.Business = b
		businessLocations = append(businessLocations, bl)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(businessLocations)
}

type Business struct {
	BusinessID  string `json:"businessID"`
	Image       string `json:"image"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Category    string `json:"category"`
}

type Location struct {
	LocationID     string  `json:"locationID"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	LatitudeDelta  float64 `json:"latitudeDelta"`
	LongitudeDelta float64 `json:"longitudeDelta"`
}

type AR struct {
	ARID        string    `json:"arID"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	CreatorID   string    `json:"creatorID"`
	CreatedDate time.Time `json:"createdDate"`
}

type ARExperienceData struct {
	ARID  string `json:"arID"`
	Key   string `json:"key"`
	Value string `json:"value"`
}

type ARBusiness struct {
	ARID       string `json:"arID"`
	BusinessID string `json:"businessID"`
}

type Product struct {
	ProductID   string  `json:"productID"`
	Image       string  `json:"image"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	BusinessID  string  `json:"businessID"`
}

type Transaction struct {
	TransactionID   string    `json:"transactionID"`
	UserID          string    `json:"userID"`
	ProductID       string    `json:"productID"`
	TransactionDate time.Time `json:"transactionDate"`
	Amount          float64   `json:"amount"`
	PaymentMethod   string    `json:"paymentMethod"`
	SquarePaymentID string    `json:"squarePaymentID"`
}

type TransactionBusiness struct {
	TransactionID string `json:"transactionID"`
	BusinessID    string `json:"businessID"`
}

type Content struct {
	ContentID   string    `json:"contentID"`
	ContentType string    `json:"contentType"`
	UserID      string    `json:"userID"`
	BusinessID  string    `json:"businessID"`
	Content     string    `json:"content"`
	CreatedDate time.Time `json:"createdDate"`
}
