package router

import (
	"fmt"
	"net/http"
	"os"
)

func NewRouter() *http.ServeMux {

	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		bytes, _ := os.ReadFile("index.html")
		fmt.Fprintf(w, "%s", string(bytes))
	})

	return router
}
