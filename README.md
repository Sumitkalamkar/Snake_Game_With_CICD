# SnakeGame

![GitHub](https://img.shields.io/badge/GitHub-Sumitkalamkar-black?style=flat&logo=github)
![Language](https://img.shields.io/badge/Language-Python-blue?style=flat&logo=python)
![Framework](https://img.shields.io/badge/Framework-Flask-lightgrey?style=flat&logo=flask)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Platform](https://img.shields.io/badge/Platform-Docker-blue?style=flat&logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-Jenkins-red?style=flat&logo=jenkins)

A simple Snake Game built using **Flask** for the backend and **JavaScript** for the frontend. The game is containerized with Docker and supports automated CI/CD via a Jenkins Pipeline.

![Architecture Diagram](ArchitectureDiagram.png)

### Web App Preview
![Snake Game WebUI](webapp.png)

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Jenkins Pipeline](#jenkins-pipeline)
- [Project Structure](#project-structure)
- [Contact](#contact)

---

## Setup Instructions

### 1. Fork & Clone the Repository

- Fork this repository: [https://github.com/Sumitkalamkar/SnakeGame](https://github.com/Sumitkalamkar/SnakeGame)
- Clone your fork locally:

```bash
git clone https://github.com/Sumitkalamkar/SnakeGame.git
cd SnakeGame
```

### 2. Launch a Server (AWS EC2)

- Launch an AWS EC2 instance with the following configuration:
  - **Instance Type:** `t2.medium`
  - **EBS Volume:** At least 15 GB
  - **Security Group:** Allow all traffic (or open ports 5000, 8080, 50000)

- Install and start Docker on your EC2 instance:

```bash
yum install docker -y
systemctl start docker
```

### 3. Jenkins Setup

**Start the Jenkins Server:**

```bash
docker run -p 8080:8080 -p 50000:50000 -dit \
  --name jenkins \
  --restart=on-failure \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk21
```

**Configure a Jenkins Agent (Slave Node):**

- Follow the official guide to add an agent: [Using Jenkins Agents](https://www.jenkins.io/doc/book/using/using-agents/)
- On your slave node, install JDK 21:

```bash
wget https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.rpm
yum install jdk-21_linux-x64_bin.rpm -y
```

- Start the agent and connect it to the Jenkins master using the provided join command.

### 4. Play the Game

Once deployed, open your browser and navigate to:

```
http://<EC2_PUBLIC_IP>:5000
```

---

## Jenkins Pipeline

The `Jenkinsfile` automates the full CI/CD workflow — testing, building, and deploying the Snake Game.

### Dynamic Docker Worker Node

This pipeline uses **dynamic worker nodes powered by Docker**. Instead of a permanent agent, whenever the pipeline is triggered, Jenkins automatically spins up a Docker container inside the master node to serve as the worker. Once the pipeline execution is complete, the container is destroyed automatically — keeping the environment clean and resource-efficient. This means every build runs in a fresh, isolated environment with no leftover state from previous runs.

### Pipeline Stages

#### Stage 1 — Download Source Code

```groovy
stage('Download the source code') {
    steps {
        git branch: 'main', url: 'https://github.com/Sumitkalamkar/SnakeGame.git'
        echo "Code downloaded successfully"
    }
}
```

#### Stage 2 — Test

Installs Python dependencies and runs unit tests with `pytest`.

```groovy
stage('Test') {
    steps {
        sh "yum install python3-pip-21.3.1-2.amzn2023.0.5.noarch -y"
        sh "pip install -r requirements.txt"
        sh "pytest"
        echo "Code has been tested successfully!"
    }
}
```

#### Stage 3 — Build Docker Image

```groovy
stage("Build Docker Image") {
    steps {
        sh "docker build -t snakegameimg ."
    }
}
```

#### Stage 4 — Deployment

```groovy
stage("Deployment") {
    steps {
        sh "docker rm -f snakegame || true"
        sh "docker run -dit --name snakegame -p 5000:5000 snakegameimg"
    }
}
```

---

## Project Structure

| File/Directory | Description |
|---|---|
| `app.py` | Main Flask application — sets up the web server and routes |
| `Dockerfile` | Instructions to build the Docker image |
| `game.js` | Game logic and canvas rendering |
| `index.html` | Frontend HTML — where the game is displayed |
| `Jenkinsfile` | Jenkins CI/CD pipeline script |
| `requirements.txt` | Python dependencies |
| `static/` | Static assets (JavaScript, CSS) |
| `test_app.py` | Unit tests for the Flask application |

---

## Docker Image

A pre-built Docker image is available on Docker Hub:

[https://hub.docker.com/r/jinny1/snakegame](https://hub.docker.com/r/jinny1/snakegame)

---

## Contact

For any inquiries or issues, feel free to reach out:

- **GitHub:** [Sumitkalamkar](https://github.com/Sumitkalamkar)
