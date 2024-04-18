package routes

import (
	"net/http"

	business "github.com/chiatzeheng/src/internal/routes/business"
	location "github.com/chiatzeheng/src/internal/routes/locations"
	products "github.com/chiatzeheng/src/internal/routes/products"
	_ "github.com/lib/pq"
)

func Router() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("hello")) })
	mux.HandleFunc("GET /fetchBusinesses", business.FetchBusinesses)
	mux.HandleFunc("GET /fetchLocations", business.FetchBL)
	mux.HandleFunc("GET /fetchProducts", products.GetProducts)
	mux.HandleFunc("POST /postBusiness", business.PostBusiness)
	mux.HandleFunc("DELETE /deleteBusiness", business.DeleteBusiness)
	mux.HandleFunc("POST /postLocation", location.PostLocation)
	mux.HandleFunc("GET /fetchProductsByID", products.FetchProductsByID)
	mux.HandleFunc("GET /fetchBusinessByID", business.FetchBusinessByID)

	return mux
}
