package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHelloHandler(t *testing.T) {
	type testCase struct {
		name        string
		method      string
		path        string
		status      int
		body        string
		allow       string
		contentType string
	}
	tests := []testCase{
		{
			name:        "root greeting",
			method:      http.MethodGet,
			path:        "/",
			status:      http.StatusOK,
			body:        "hello world",
			contentType: "text/plain; charset=utf-8",
		},
		{
			name:   "unknown path",
			method: http.MethodGet,
			path:   "/unknown",
			status: http.StatusNotFound,
		},
	}

	for _, method := range []string{
		http.MethodHead, http.MethodPost, http.MethodPut,
		http.MethodPatch, http.MethodDelete, http.MethodOptions,
	} {
		tests = append(tests, testCase{
			name:   "reject " + method,
			method: method,
			path:   "/",
			status: http.StatusMethodNotAllowed,
			allow:  http.MethodGet,
		})
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			request := httptest.NewRequest(tt.method, tt.path, nil)
			recorder := httptest.NewRecorder()

			helloHandler(recorder, request)

			if recorder.Code != tt.status {
				t.Fatalf("expected status %d, got %d", tt.status, recorder.Code)
			}
			if tt.status == http.StatusOK && recorder.Body.String() != tt.body {
				t.Errorf("expected body %q, got %q", tt.body, recorder.Body.String())
			}
			if got := recorder.Header().Get("Allow"); got != tt.allow {
				t.Errorf("expected Allow %q, got %q", tt.allow, got)
			}
			if tt.contentType != "" && recorder.Header().Get("Content-Type") != tt.contentType {
				t.Errorf("expected Content-Type %q, got %q", tt.contentType, recorder.Header().Get("Content-Type"))
			}
		})
	}
}
