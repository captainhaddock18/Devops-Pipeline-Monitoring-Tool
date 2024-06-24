package main

import (
    "fmt"
    "net/http"
    "github.com/rs/cors"
)

func main() {
    mux := http.NewServeMux()

    mux.HandleFunc("/thar", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "GET REQUEST PERFECT")
    })

    // Create the CORS middleware
    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:3000"}, // Change this to the origin you want to allow
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    })

    // Wrap your handler with the CORS middleware
    handler := c.Handler(mux)

    http.ListenAndServe(":3010", handler)
}
