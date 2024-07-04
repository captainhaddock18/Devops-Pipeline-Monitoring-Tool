# JobPulse: Jenkins Jobs Managing Interface

## Overview

JobPulse is an innovative web application designed to manage Jenkins jobs through a user-friendly interface. The frontend is developed using React with Tailwind CSS for sleek styling, while the backend is powered by Go. This application leverages Jenkins APIs to facilitate various operations on jobs, including creating new jobs, deleting jobs, building jobs with delays, retrieving job histories, listing all jobs, and fetching `config.xml` configurations.

## Features

- Create, delete, and manage Jenkins jobs
- Build jobs with custom delays
- View detailed job histories
- List all jobs for easy management
- Fetch and view job configurations (`config.xml`)

## Prerequisites

- Node.js and npm (for the frontend)
- Go (for the backend)
- Jenkins installed and running on `localhost:8080`
- Jenkins API token and username

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/JobPulse.git
    cd JobPulse
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

    Ensure Jenkins is running on `localhost:8080`. If Jenkins is not installed, follow the [installation guide](https://www.jenkins.io/doc/book/installing/).

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
- Use the interface to manage Jenkins jobs efficiently.
- JobPulse utilizes REST APIs for updates on job activities.

## Purpose

JobPulse was created to explore Go programming basics, API integrations, and Continuous Integration/Continuous Deployment (CI/CD) practices through a robust job management interface.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## Authors

- **Tharakadatta D Hegde**
- **Varshit Manikanta**
