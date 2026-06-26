# Actudent Website

This is the static website for Actudent.

## Deployment

This project includes Docker support for easy deployment and local development using Nginx.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Local Development & Deployment using Docker Compose

The easiest way to run the website is using Docker Compose. The configuration is set up to build the Docker image and serve the static files via an Nginx server. It also maps your local files into the container so you can see changes instantly during development.

1. **Build and start the container in detached mode:**
   ```bash
   docker compose up -d
   ```
2. **View the website:** 
   Open your browser and navigate to `http://localhost`.
3. **Make changes:**
   Any changes you make to the HTML, CSS, or JS files will instantly reflect in the browser upon refresh without needing to rebuild or restart the container (thanks to volume mounts).
4. **Stop the container:**
   ```bash
   docker compose down
   ```

### Standalone Docker Build

If you prefer to build and run the Docker image without Docker Compose (e.g., for a production deployment where volume mapping is not needed):

1. **Build the Docker image:**
   ```bash
   docker build -t actudent-website .
   ```
2. **Run the container:**
   ```bash
   docker run -d -p 80:80 --name actudent-website actudent-website
   ```
