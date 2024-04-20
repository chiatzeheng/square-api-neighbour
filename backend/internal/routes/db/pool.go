package pool

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
)

func Pool() (*pgxpool.Pool, error) {
	err := godotenv.Load("../../../.env")
	if err != nil {
		return nil, fmt.Errorf("Error loading .env file: %w", err)
	}

	dsn := os.Getenv("DSN")
	if dsn == "" {
		return nil, errors.New("DSN environment variable is not set")
	}

	ctx := context.Background()
	pool, err := pgxpool.Connect(ctx, dsn)
	if err != nil {
		return nil, fmt.Errorf("Failed to connect to database: %w", err)
	}

	// Return the pool
	return pool, nil
}
