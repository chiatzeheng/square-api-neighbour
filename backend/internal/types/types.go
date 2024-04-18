package types

import "time"

type Business struct {
	BusinessID  string   `json:"businessID"`
	Images      []string `json:"image,omitempty"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Category    string   `json:"category"`
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
	ProductID    string         `json:"productID"`
	Images       []string       `json:"image,omitempty"`
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	Price        float64        `json:"price"`
	Reviews      []Review       `json:"reviews,omitempty"`
	Expect       []Expect       `json:"expect"`
	BusinessID   string         `json:"businessID"`
	Instructions []Instructions `json:"faq,omitempty"`
}

type Instructions struct {
	InstructionID string   `json:"instructionID "`
	Image         []string `json:"image,omitempty"`
	Text          string   `json:"instruction"`
}

type Expect struct {
	ExpectID    string `json:"expectID"`
	Image       string `json:"productID"`
	Description string `json:"expect"`
}

type Review struct {
	ReviewID   string    `json:"reviewID"`
	ProductID  string    `json:"productID"`
	ReviewDate time.Time `json:"reviewDate"`
	Rating     float32   `json:"rating"`
	Review     string    `json:"review"`
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
