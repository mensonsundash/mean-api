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
                    def isMergeCommit = bat(script: "git log -1 --pretty=%B | findstr /C:\"Merge pull request #\"", returnStdout: true).trim()
                    if (!isMergeCommit.isEmpty()) {
                        // Merge to main
                        bat "git checkout main"
                        bat "git merge release/V-0.0.1"
                        bat "git push origin main"
                    }
                }
            }
        }
    }
}
