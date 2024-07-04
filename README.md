# DevOps Pipeline Monitoring Tool

## Overview

The DevOps Pipeline Monitoring Tool is a web application that allows users to manage Jenkins jobs through a user-friendly interface. The frontend is built with React and styled using Tailwind CSS, while the backend is implemented in Go. The application interacts with Jenkins APIs to perform various operations on Jenkins jobs, including creating new jobs, deleting jobs, building jobs with delays, fetching job history, listing jobs, and retrieving the `config.xml` for any job.

## Features

- Create a new Jenkins job
- Delete a Jenkins job
- Build a Jenkins job with a specified delay
- Retrieve the history of Jenkins jobs
- List all Jenkins jobs
- Fetch the `config.xml` for any Jenkins job

## Prerequisites

- Node.js and npm (for the frontend)
- Go (for the backend)
- Jenkins installed and running on `localhost:8080`
- Jenkins API token and username

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/Devops-Pipeline-Monitoring-Tool.git
    cd Devops-Pipeline-Monitoring-Tool
    ```

2. **Set up the frontend:**

    ```sh
    cd frontend
    npm install
    ```

3. **Set up the backend:**

    ```sh
    cd ../backend
    go mod tidy
    ```

## Running the Application

1. **Start the Jenkins server:**

    Ensure Jenkins is running on `localhost:8080`. If not already installed, follow the [Jenkins installation guide](https://www.jenkins.io/doc/book/installing/).

2. **Run the Go backend:**

    ```sh
    cd backend
    go run main.go
    ```

    The backend will start on `localhost:3010`.

3. **Run the React frontend:**

    ```sh
    cd ../frontend
    npm start
    ```

    The frontend will start on `localhost:3000`.

## Jenkins Setup

1. **Obtain Jenkins API Token:**

    - Log in to Jenkins.
    - Click on your username (top right corner).
    - Click on `Configure` (left sidebar).
    - Scroll down to `API Token` section.
    - Click on `Add new Token`.
    - Give it a name and click on `Generate`.
    - Copy the generated token and save it securely.

## Usage

- Open your browser and navigate to `http://localhost:3000`.
- Use the interface to perform various operations on Jenkins jobs.
- The application will use REST APIs to give updates on recent builds.

## Purpose

We took up this project to understand the basics of Go and build a basic server in Go and use APIs. Additionally, we aimed to explore Continuous Integration/Continuous Deployment (CI/CD) practices.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.


## Authors

- **Tharakadatta D Hegde**
- **Varshit Manikanta**
