package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	w.WriteHeader(http.StatusOK)
	_, _ = fmt.Fprint(w, "hello multiple revision with auto approval!!")
}

func main() {
	http.HandleFunc("/", helloHandler)

	if err := http.ListenAndServe(":3000", nil); err != nil {
		panic(err)
	}
}
