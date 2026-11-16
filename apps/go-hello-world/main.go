package main

import (
	"io"
	"log"
	"net/http"
	"time"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	if _, err := io.WriteString(w, "hello world"); err != nil {
		log.Printf("write hello world response: %v", err)
	}
}

func main() {
	server := &http.Server{
		Addr:              ":3000",
		Handler:           http.HandlerFunc(helloHandler),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("listening on %s", server.Addr)
	log.Fatal(server.ListenAndServe())
}
