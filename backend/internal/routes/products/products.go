package products

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

func FetchProductsByID(w http.ResponseWriter, r *http.Request) {
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

	query := `SELECT p.productID, p.image, p.name, p.description, p.price, p.rating, 
	r.reviews, e.expect, p.businessID, i.text, ,
	FROM products p
	LEFT JOIN reviews r ON p.productID = r.productID
	LEFT JOIN expect e ON p.productID = e.productID
	LEFT JOIN instructions i ON p.productID = i.productID
	WHERE p.productID = $1;`

	// Fetch productes from the database
	rows, err := pool.Query(context.Background(), query, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// var products []types.Product
	// for rows.Next() {
	// 	var p types.Product
	// 	err := rows.Scan(&p.ProductID, &p.Images, &p.Name, &p.Description, &p.Price)
	// 	if err != nil {
	// 		http.Error(w, err.Error(), http.StatusInternalServerError)
	// 		return
	// 	}
	// 	products = append(products, p)
	// }

	// Convert the productes to JSON and send the response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// func GetProducts(w http.ResponseWriter, r *http.Request) {

// 	if r.Method != http.MethodGet {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	rows, err := pool.Query(r.Context(), `SELECT productid, images, name, description, price,  FROM "defaultdb"."Product";`)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	defer rows.Close()

// 	var products []types.Product

// 	for rows.Next() {
// 		var p types.Product
// 		//var priceValue interface{} // Use interface{} to handle any type

// 		err := rows.Scan(&p.ProductID, &p.Images, &p.Name, &p.Description, &p.Price, &p.productID)
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		products = append(products, p)
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(products)
// }

func PostProducts(w http.ResponseWriter, r *http.Request) {
	// Check if the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the request body into a product object
	var product types.Product
	err := json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert the product data into the database
	// Example: You need to implement this part according to your database schema
	_, err = pool.Exec(context.Background(), `INSERT INTO "defaultdb"."Products" (productID, images, name, description, category) VALUES ($1, $2, $3, $4, $5)`, product.productID, product.Images, product.Name, product.Description, product.Category)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with the created product data
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}
