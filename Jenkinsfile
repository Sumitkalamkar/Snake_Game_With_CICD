pipeline {

    agent {
        docker {
            image 'python:3.11'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {

        stage('Download the source code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/YOUR_USERNAME/SnakeGame.git'

                echo "Code downloaded successfully"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                sh 'pytest'

                echo "Code has been tested successfully!"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t snakegame .'
            }
        }

        stage('Deployment') {
            steps {
                sh 'docker rm -f snakegame || true'

                sh 'docker run -dit --name snakegame -p 5000:5000 snakegame'
            }
        }
    }
}
