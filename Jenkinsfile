pipeline {

    agent {
        docker {
            image 'docker:27.0.3'
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {

        stage('Install Python') {
            steps {
                sh 'apk add --no-cache python3 py3-pip py3-pytest'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pip install --break-system-packages -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                sh 'python3 -m pytest'

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
