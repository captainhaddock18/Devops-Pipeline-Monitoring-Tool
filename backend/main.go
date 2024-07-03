package main

import (
	"encoding/json"
	"fmt"
	"io"
	"encoding/base64"
	"log"
	"net/http"
	"bytes"
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

type JobInfo struct {
	Name  string `json:"name"`
	URL   string `json:"url"`
	Color string `json:"color"`
	// Add more fields as needed
}

func getJobInfo(jobName string) (*JobInfo, error) {
	url := fmt.Sprintf("http://localhost:8080//job/%s/api/json?tree=builds[number,status,timestamp,id,result]", jobName) // /job/${job_name}/lastBuild/api/json?tree=result,timestamp,estimatedDuration
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
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

	fmt.Println(string(body))

	var jobInfo JobInfo
	err = json.Unmarshal(body, &jobInfo)
	if err != nil {
		log.Fatalf("Failed to unmarshal JSON: %v", err)
	}

	return &jobInfo, nil
}

func main() {

	mux := http.NewServeMux()

	mux.HandleFunc("/thar", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "GET REQUEST PERFECT")
		fmt.Println("GET Request perfect")
	})

	mux.HandleFunc("/job-info", func(w http.ResponseWriter, r *http.Request) {
		params := r.URL.Query()
		jobName := params.Get("job")
		jobInfo, err := getJobInfo(jobName)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Job Name: %s\n", jobInfo.Name)
		fmt.Printf("Job URL: %s\n", jobInfo.URL)
		fmt.Printf("Job Color: %s\n", jobInfo.Color)
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
	mux.HandleFunc("/create-job", func(w http.ResponseWriter, r *http.Request) {
		// Extract query parameters from the incoming request
		username := r.URL.Query().Get("username")
		apiToken := r.URL.Query().Get("apiToken")
		jobName := r.URL.Query().Get("jobName")

		// Check if the required parameters are present
		if username == "" || apiToken == "" {
			http.Error(w, "Missing username or apiToken parameter", http.StatusBadRequest)
			return
		}

		// Read the request body from the incoming request
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to read request body: %v", err), http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		// Prepare the Jenkins API request
		url := "http://localhost:8080/createItem?name=" + jobName
		client := &http.Client{}
		req, err := http.NewRequest("POST", url, bytes.NewReader(body))
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to create request: %v", err), http.StatusInternalServerError)
			return
		}

		// Set Basic Auth header
		auth := username + ":" + apiToken
		encodedAuth := base64.StdEncoding.EncodeToString([]byte(auth))
		req.Header.Add("Authorization", "Basic "+encodedAuth)
		req.Header.Add("Content-Type", "text/xml") // Assuming the job config is in XML format

		// Make the request to Jenkins
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to make request to Jenkins: %v", err), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// Check if the response is successful
		if resp.StatusCode != http.StatusOK {
			http.Error(w, fmt.Sprintf("Failed to create job: received status code %d", resp.StatusCode), resp.StatusCode)
			return
		}

		fmt.Fprintf(w, "Job successfully created with name %s", jobName)
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
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"}, // Change this to the origin you want to allow
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Wrap your handler with the CORS middleware
	handler := c.Handler(mux)
	log.Fatal(http.ListenAndServe(":3010", handler))

}
