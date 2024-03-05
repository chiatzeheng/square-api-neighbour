// routes/routes.go

package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

type Handler struct {
	db *gorm.DB
}

var db *gorm.DB

// Declare db as a global variable accessible within the package

// A Product contains metadata about a product for sale.
type Product struct {
	ID          int
	Name        string
	Description string
	Image       string
	CategoryID  int
	Category    Category `gorm:"foreignKey:CategoryID"`
}

// A Category describes a group of Products.
type Category struct {
	ID          int
	Name        string
	Description string
}

// seedDatabase is the HTTP handler for GET /seed.
func seedDatabase(c *gin.Context) {
	// Perform initial schema migrations.
	if err := db.AutoMigrate(&Product{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to migrate products table"})
		return
	}

	if err := db.AutoMigrate(&Category{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to migrate categories table"})
		return
	}

	// Seed categories and products for those categories.
	db.Create(&Category{
		Name:        "Phone",
		Description: "Description 1",
	})
	db.Create(&Category{
		Name:        "Video Game Console",
		Description: "Description 2",
	})

	db.Create(&Product{
		Name:        "iPhone",
		Description: "Description 1",
		Image:       "Image 1",
		Category:    Category{ID: 1},
	})
	db.Create(&Product{
		Name:        "Pixel Pro",
		Description: "Description 2",
		Image:       "Image 2",
		Category:    Category{ID: 1},
	})
	db.Create(&Product{
		Name:        "Playstation",
		Description: "Description 3",
		Image:       "Image 3",
		Category:    Category{ID: 2},
	})
	db.Create(&Product{
		Name:        "Xbox",
		Description: "Description 4",
		Image:       "Image 4",
		Category:    Category{ID: 2},
	})
	db.Create(&Product{
		Name:        "Galaxy S",
		Description: "Description 5",
		Image:       "Image 5",
		Category:    Category{ID: 1},
	})

	c.String(http.StatusOK, "Migrations and Seeding of database complete\n")
}

func SetDB(database *gorm.DB) {
	db = database
}

func Router() *gin.Engine {

	seedDatabase()
	router := gin.Default()
	gin.SetMode(gin.ReleaseMode)
	router.GET("/products", GetProducts)
	return router
}

func GetProducts(c *gin.Context) {
	var products []Product
	result := db.Preload("Category").Find(&products)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, products)
}
