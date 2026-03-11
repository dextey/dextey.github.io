package router

import (
	"html/template"
	"net/http"
)

func parseTemplate(base string, partials ...string) (*template.Template, error) {
	files := append([]string{base}, partials...)
	return template.ParseFiles(files...)
}

func NewRouter() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := parseTemplate(
			"index.html",
			"sections/main.html",
			"sections/forge.html",
			"sections/buildstack.html",
			"sections/endnode.html",
		)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		tmpl.ExecuteTemplate(w, "index.html", nil)
	})

	router.HandleFunc("GET /test", func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := parseTemplate("test.html")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		tmpl.ExecuteTemplate(w, "test.html", nil)
	})

	return router
}
