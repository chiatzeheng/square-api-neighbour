package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"

	"github.com/chiatzeheng/src/internal/types"

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
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query(r.Context(), `SELECT * FROM "defaultdb"."Product";`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []types.Product

	for rows.Next() {
		var p types.Product
		//var priceValue interface{} // Use interface{} to handle any type

		err := rows.Scan(&p.ProductID, &p.Image, &p.Name, &p.Description, &p.Price, &p.BusinessID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		products = append(products, p)
	}

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

	var businesses []types.Business
	for rows.Next() {
		var b types.Business
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
		types.Location
		types.Business
	}

	var businessLocations []BusinessLocation

	for rows.Next() {
		var bl BusinessLocation
		var l types.Location
		var b types.Business
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
	var business types.Business
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
	var location types.Location
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

	var businesses []types.Business
	for rows.Next() {
		var b types.Business
		err := rows.Scan(&b.BusinessID, &b.Image, &b.Name, &b.Description, &b.Category)
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
		http.Error(w, "Product ID Not Provided ", http.StatusBadRequest)
		return
	}

	// Fetch businesses from the database
	rows, err := db.Query(context.Background(), `SELECT * FROM "defaultdb"."Product" WHERE businessid = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []types.Product
	for rows.Next() {
		var p types.Product
		err := rows.Scan(&p.ProductID, &p.Image, &p.Name, &p.Description, &p.Price, &p.BusinessID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	// Convert the businesses to JSON and send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}
