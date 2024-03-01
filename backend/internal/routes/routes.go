// routes/routes.go

package routes

import (
	"log"
	"net/http"

	"database/sql"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB // Declare db as a global variable accessible within the package

func SetDB(database *sql.DB) {
	db = database
}

func Router() *gin.Engine {
	router := gin.Default()
	gin.SetMode(gin.ReleaseMode)
	router.GET("/products", GetProducts)
	return router
}

func GetProducts(c *gin.Context) {
	query := "SHOW TABLES;"
	res, err := db.Query(query)
	if err != nil {
		log.Fatal("(GetProducts) db.Query", err)
	}
	defer func() {
		if cerr := res.Close(); cerr != nil {
			log.Printf("error closing rows: %v\n", cerr)
		}
	}()
	// Handle res and send response
	println(res)
	c.JSON(http.StatusOK, res)

}
