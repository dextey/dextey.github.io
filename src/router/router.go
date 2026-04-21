package router

import (
	"bytes"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

const (
	basePage  = "index.html"
	actsGlob  = "src/templates/*.html"
	devEnvVar = "DEV"
)

func parse() (*template.Template, error) {
	acts, err := filepath.Glob(actsGlob)
	if err != nil {
		return nil, err
	}
	return template.ParseFiles(append([]string{basePage}, acts...)...)
}

func NewRouter() *http.ServeMux {
	router := http.NewServeMux()

	page, err := parse()
	if err != nil {
		log.Fatalf("parsing templates: %v", err)
	}
	dev := os.Getenv(devEnvVar) == "1"

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		tmpl := page
		if dev {
			fresh, err := parse()
			if err != nil {
				log.Printf("parsing templates: %v", err)
				http.Error(w, "template error", http.StatusInternalServerError)
				return
			}
			tmpl = fresh
		}

		var buf bytes.Buffer
		if err := tmpl.ExecuteTemplate(&buf, basePage, nil); err != nil {
			log.Printf("rendering %s: %v", basePage, err)
			http.Error(w, "template error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		buf.WriteTo(w)
	})

	return router
}
