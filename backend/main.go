package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/rs/cors"
)

var (
	JenkinsURL   = "http://localhost:8080/api/json?tree=jobs[name,color]" // jenkins_url + /api/json?tree=jobs[name,color]
	JenkinsUser  = ""                                             // Your username
	JenkinsToken = ""                   // Your API key
)

type Job struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

type JenkinsResponse struct {
	Jobs []Job `json:"jobs"`
}

func getJenkinsJobs() ([]Job, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", JenkinsURL, nil)
	if err != nil {
		log.Fatalf("Failed to create request: %v", err)
	}

	req.SetBasicAuth(JenkinsUser, JenkinsToken)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Fatalf("Unexpected response status: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response body: %v", err)
	}

	var jenkinsResp JenkinsResponse
	err = json.Unmarshal(body, &jenkinsResp)
	if err != nil {
		log.Fatalf("Failed to unmarshal JSON: %v", err)
	}

	// Prints the list of jobs in the terminal of server
	for _, job := range jenkinsResp.Jobs {
		fmt.Printf("Job Name: %s, Job Color: %s\n", job.Name, job.Color)
	}

	return jenkinsResp.Jobs, nil
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/thar", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "GET REQUEST PERFECT")
		fmt.Println("GET Request perfect")
	})

	mux.HandleFunc("/auth", func(w http.ResponseWriter, r *http.Request) {
		// Extract query parameters from the incoming request
		username := r.URL.Query().Get("username")
		apiToken := r.URL.Query().Get("apiToken")

		// fmt.Println(JenkinsUser, JenkinsToken)

		// fmt.Println(username , apiToken);
		// Check if the required parameters are present
		if username == "" || apiToken == "" {
			http.Error(w, "Missing username or apiToken parameter", http.StatusBadRequest)
			return
		}
		JenkinsUser = username
		JenkinsToken = apiToken
	})

	mux.HandleFunc("/get-jobs", func(w http.ResponseWriter, r *http.Request) {
		username := r.URL.Query().Get("username")
		apiToken := r.URL.Query().Get("apiToken")

		// fmt.Println(JenkinsUser, JenkinsToken)

		// fmt.Println(username , apiToken);
		// Check if the required parameters are present
		if username == "" || apiToken == "" {
			http.Error(w, "Missing username or apiToken parameter", http.StatusBadRequest)
			return
		}
		JenkinsUser = username
		JenkinsToken = apiToken
		
		jobs, err := getJenkinsJobs()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(jobs)
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
	log.Fatal(http.ListenAndServe(":3010", handler))

}
