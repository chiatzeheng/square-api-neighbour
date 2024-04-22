package business

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	db "github.com/chiatzeheng/src/internal/routes/db"
	"github.com/chiatzeheng/src/internal/types"
	"github.com/jackc/pgx/v4/pgxpool"
)

var pool *pgxpool.Pool

func init() {
	var err error
	pool, err = db.Pool()
	if err != nil {
		log.Fatal(err)
	}
}

func FetchBusinesses(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}

	// Fetch businesses from the database
	rows, err := pool.Query(context.Background(), `SELECT "businessid", "name", "images", "description", "category" FROM "defaultdb"."Business";`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	defer rows.Close()

	var businesses []types.Business
	for rows.Next() {
		var b types.Business
		err := rows.Scan(&b.BusinessID, &b.Name, &b.Images, &b.Description, &b.Category)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		businesses = append(businesses, b)
	}

	// Convert the businesses to JSON send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(businesses)
}

func FetchBL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := pool.Query(context.Background(), `
		SELECT
			b."businessid",
			b."name",
			b."images",
			b."description",
			b."category",
			l."latitude",
			l."longitude",
			l."latitudedelta",
			l."longitudedelta"
		FROM
			"defaultdb"."Location" l
		JOIN
			"defaultdb"."Business" b ON b."businessid" = l."locationid";
	`)
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
		err := rows.Scan(&b.BusinessID, &b.Name, &b.Images, &b.Description, &b.Category, &l.Latitude, &l.Longitude, &l.LatitudeDelta, &l.LongitudeDelta)
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

func PostBusiness(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the request body into a Business object
	var business types.Business
	err := json.NewDecoder(r.Body).Decode(&business)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	// Insert the business data into the database
	_, err = pool.Exec(context.Background(), `
        INSERT INTO "defaultdb"."Business" (businessID, images, name, description, category)
        VALUES ($1, $2, $3, $4, $5)`,
		business.BusinessID, business.Images, business.Name, business.Description, business.Category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the created business data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(business)
}

func DeleteBusiness(w http.ResponseWriter, r *http.Request) {
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
	err := pool.QueryRow(context.Background(), `SELECT COUNT(*) FROM "defaultdb"."Business" WHERE businessID = $1`, businessID).Scan(&count)
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
	_, newerr := pool.Exec(context.Background(), `DELETE FROM "defaultdb"."Business" WHERE businessID = $1 `, businessID)
	if newerr != nil {
		http.Error(w, newerr.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with success message
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Business deleted successfully"})
}

func FetchBusinessByID(w http.ResponseWriter, r *http.Request) {
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
	rows, err := pool.Query(context.Background(), `SELECT "businessid", "name", "images", "description", "category"  FROM "defaultdb"."Business" WHERE businessID = $1`, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var businesses []types.Business
	for rows.Next() {
		var b types.Business
		err := rows.Scan(&b.BusinessID, &b.Name, &b.Images, &b.Description, &b.Category)
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
