package main

import (
	"fmt"
	"net/http"
	"websgrpcgo/services"
)

func main() {
	fmt.Printf("Starting server on :9000\n")
	handleRoutes()
	http.ListenAndServe(":9000", nil)
}

func handleRoutes() {
	http.HandleFunc("/status", services.Status)
	http.HandleFunc("/webs", services.HandleNews)
}
