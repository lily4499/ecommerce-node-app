pipeline {
    agent any

    environment {
        HELM_REPO_NAME = "my-repo"
        HELM_REPO_URL = "https://lily4499.github.io/helm-charts"
        CHART_NAME = "ecommerce-node-app-chart"
        RELEASE_NAME = "ecommerce-app"
        HELM_VERSION = "0.1.0"
        VALUES_FILE = "my-values.yaml"  // Update if using custom values
        AWS_REGION = 'us-east-1'
        ECR_REPO = 'my-ecr-repo'  // Change to your actual ECR repo name
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/lily4499/ecommerce-node-app.git'
            }
        }
        
        stage('Get AWS Account ID') {
            steps {
                script {
                    env.AWS_ACCOUNT_ID = sh(script: "aws sts get-caller-identity --query Account --output text", returnStdout: true).trim()
                    echo "AWS Account ID: ${env.AWS_ACCOUNT_ID}"
                }
            }
        }
        

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t my-image:latest .

                # Authenticate Docker to AWS ECR
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

                # Tag the image with AWS ECR repository
                docker tag my-image:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest

                # Push the image to AWS ECR
                docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest
                '''
            }
        }

        stage('Setup Helm Repo') {
            steps {
                script {
                    sh "helm repo add ${HELM_REPO_NAME} ${HELM_REPO_URL}"
                    sh "helm repo update"
                }
            }
        }

        stage('Verify Helm Repository') {
            steps {
                script {
                    sh "helm search repo ${HELM_REPO_NAME}"
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    def valuesFileExists = fileExists("${VALUES_FILE}")
                    if (valuesFileExists) {
                        sh "helm install ${RELEASE_NAME} -f ${VALUES_FILE} ${HELM_REPO_NAME}/${CHART_NAME} --version ${HELM_VERSION}"
                    } else {
                        sh "helm install ${RELEASE_NAME} ${HELM_REPO_NAME}/${CHART_NAME} --version ${HELM_VERSION}"
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh "helm repo list"
                    sh "helm list"
                    sh "kubectl get pods,svc,deploy"
                }
            }
        }
    }

    post {
        failure {
            echo "Deployment failed! Please check logs."
        }
        success {
            echo "Deployment successful! Application is up and running."
        }
    }
}
