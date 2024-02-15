pipeline {
    agent any

    stages {
        stage('Check Out') {
            steps {
                git branch: 'release/V-0.0.1', url: 'https://github.com/mensonsundash/mean-api.git'
            }
        }
        stage('Merge to Main') {
            steps {
                script {
                    // Check if the commit is a merge commit
                    def isMergeCommit = sh(script: "git log -1 --pretty=%B | grep 'Merge pull request #'", returnStdout: true).trim()
                    if (isMergeCommit) {
                        // Merge to main
                        sh "git checkout main"
                        sh "git merge release/V-0.0.1"
                        sh "git push origin main"
                    }
                }
            }
        }
    }
}