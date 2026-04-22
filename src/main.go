package main

import (
	"dextey/src/router"
	"fmt"
	"net/http"
)

func main() {
	router := router.NewRouter()

	staticFiles := http.FileServer(http.Dir("static"))
	router.Handle("GET /static/", http.StripPrefix("/static", staticFiles))

	server := http.Server{
		Addr:    ":3000",
		Handler: router,
	}

	fmt.Println("Server Listening on port 3000")

	server.ListenAndServe()
}
