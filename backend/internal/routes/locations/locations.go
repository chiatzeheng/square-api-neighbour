package locations

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

func PostLocation(w http.ResponseWriter, r *http.Request) {
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

	_, err = pool.Exec(context.Background(), `INSERT INTO "defaultdb"."Location" (LocationID, Latitude, Longitude, LatitudeDelta, LongitudeDelta) VALUES ($1, $2, $3, $4, $5)`, location.LocationID, location.Latitude, location.Longitude, location.LatitudeDelta, location.LongitudeDelta)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the created business data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(location)
}
