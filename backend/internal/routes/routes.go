package routes

import (
	"context"
	"encoding/json"
	"fmt"
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
	mux.HandleFunc("GET /fetchBusinesses", fetchBusinesses)
	mux.HandleFunc("GET /fetchLocations", fetchBL)
	mux.HandleFunc("GET /fetchProducts", getProducts)
	mux.HandleFunc("POST /postBusiness", postBusiness)
	mux.HandleFunc("DELETE /deleteBusiness", deleteBusiness)
	mux.HandleFunc("POST /postLocation", postLocation)
	mux.HandleFunc("GET /fetchProductsByID", fetchProductsByID)
	mux.HandleFunc("GET /fetchBusinessByID", fetchBusinessByID)

	return mux
}

func getProducts(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Execute the query with a context
	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."Product"; `)

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

func postBusiness(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println()

	// Decode the request body into a Business object
	var business Business
	err := json.NewDecoder(r.Body).Decode(&business)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert the business data into the database
	// Example: You need to implement this part according to your database schema
	_, err = db.Exec(context.Background(), `INSERT INTO "defaultdb"."Business" (businessID, image, name, description, category) VALUES ($1, $2, $3, $4, $5)`, business.BusinessID, business.Image, business.Name, business.Description, business.Category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the created business data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(business)
}

func deleteBusiness(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is DELETE
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	businessID := r.URL.Query().Get("id")
	if businessID == "" {
		http.Error(w, "BusinessID not provided", http.StatusBadRequest)
		return
	}

	var count int
	err := db.QueryRow(context.Background(), `SELECT COUNT(*) FROM "defaultdb"."Business" WHERE businessID = $1`, businessID).Scan(&count)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// If the count is 0, the business doesn't exist, so return an error
	if count == 0 {
		http.Error(w, "Business not found", http.StatusNotFound)
		return
	}

	// Execute the delete query
	_, newerr := db.Exec(context.Background(), `DELETE FROM "defaultdb"."Business" WHERE businessID = $1 `, businessID)
	if newerr != nil {
		http.Error(w, newerr.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with success message
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Business deleted successfully"})
}

func postLocation(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the request body into a Business object
	var location Location
	err := json.NewDecoder(r.Body).Decode(&location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert the business data into the database
	// Example: You need to implement this part according to your database schema
	_, err = db.Exec(context.Background(), `INSERT INTO "defaultdb"."Location" (LocationID, Latitude, Longitude, LatitudeDelta, LongitudeDelta) VALUES ($1, $2, $3, $4, $5)`, location.LocationID, location.Latitude, location.Longitude, location.LatitudeDelta, location.LongitudeDelta)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the created business data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(location)
}

func fetchBusinessByID(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Business ID Not Provided ", http.StatusBadRequest)
		return
	}

	// Fetch businesses from the database
	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."Business" WHERE businessID = $1`, id)
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

func fetchProductsByID(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Business ID Not Provided ", http.StatusBadRequest)
		return
	}

	// Execute the query with a context
	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."Product" p WHERE productID = $1`, id)

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
