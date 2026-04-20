pipeline {
    agent any
    
    stages {
        stage('Pull Code') {
            steps {
                checkout scm
            }
        }
        
        stage('SonarQube Scan') {
            when {
                // Execute this stage only if changes are made to the develop branch
                expression { env.BRANCH_NAME == 'develop' }
            }
            steps {
                script {
                    def scannerHome = tool 'sonar'
                    withSonarQubeEnv('sonar') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        
        stage('Deploy to develop Server') {
            when {
                // Execute this stage only if changes are made to the develop branch
                expression { env.BRANCH_NAME == 'develop' }
            }
            steps {
                script {
                    def qualityGate = waitForQualityGate()
                    if (qualityGate.status != 'OK') {
                        error "Code did not meet quality gate criteria"
                    }
                }
                sshagent(['yieldz']) {
                    sh 'ssh yieldz@182.75.105.186 "cd /home/yieldz && sh deploy-dev-app.sh"'
                }
            }
            post {
                failure {
                    emailext subject: "Dev Deployment Failed",
                              body: """This is an automated notification regarding the recent deployment of <b>yieldz app</b> in the <b>Dev</b> environment.<br>
                                    Unfortunately, the deployment encountered errors. Attached to this email are the deployment logs for your review.<br><br><br>
                                    
                                    Best regards,<br>
                                    DevOps Team <br>
                                    Debut Infotech""",
                              to: "yieldz@debutinfotech.com",
                              from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                              mimeType: 'text/html',
                              attachLog: true
                }
                success {
                    emailext subject: "Dev Deployment Successful",
                              body: """This is an automated notification regarding the recent deployment of <b>yieldz app</b> in the <b>Dev</b> environment.<br>
                                    The deployment process has completed successfully. The latest version of the application has been successfully deployed, and the system is now running as expected.<br><br><br>
                                
                                Best regards,<br>
                                DevOps Team <br>
                                Debut Infotech""",
                              to: "yieldz@debutinfotech.com",
                              from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                              mimeType: 'text/html'
                }
            }
        }
        
        stage('Deploy to QA Server') {
            when {
                // Execute this stage only if changes are made to the qa branch
                expression { env.BRANCH_NAME == 'qa' }
            }
            steps {
                sshagent(['yieldz-qa']) {
                    script {
                        def qaDeploymentStatus = sh(script: 'ssh -o StrictHostKeyChecking=no ubuntu@13.232.50.167 "cd /var/www && sh deploy-qa-app.sh"', returnStatus: true)
                        if (qaDeploymentStatus != 0) {
                            emailext subject: "QA Deployment Failed",
                                      body: """This is an automated notification regarding the recent deployment of <b>yieldz app</b> in the <b>QA</b> environment.<br>
                                            Unfortunately, the deployment encountered errors. Attached to this email are the deployment logs for your review. <br><br><br>
                                            
                                            Best regards,<br>
                                            DevOps Team <br>
                                            Debut Infotech""",
                                      to: "yieldz@debutinfotech.com",
                                      from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                                      mimeType: 'text/html'
                        } else {
                            emailext subject: "QA Deployment Successful",
                                      body: """This is an automated notification regarding the recent deployment of <b>yieldz app</b> in the <b>QA</b> environment. <br>
                                      The deployment process has completed successfully. The latest version of the application has been successfully deployed, and the system is now running as expected.<br><br><br>
                                      
                                      Best regards,<br>
                                      DevOps Team<br>
                                      Debut Infotech""",
                                      to: "yieldz@debutinfotech.com",
                                      from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                                      mimeType: 'text/html'
                        }
                    }
                }
            }
        }
        
        stage('Deploy to UAT Server') {
            when {
                // Execute this stage only if changes are made to the uat branch
                expression { env.BRANCH_NAME == 'uat' }
            }
            steps {
                sshagent(['prc-uat']) {
                    script {
                        def uatDeploymentStatus = sh(script: 'ssh -o StrictHostKeyChecking=no ubuntu@107.20.196.34 "cd /var/www/ && sh deploy-icoapi.sh"', returnStatus: true)
                        if (uatDeploymentStatus != 0) {
                            emailext subject: "UAT Deployment Failed",
                                      body: """This is an automated notification regarding the recent deployment of <b>PRC ICO-API </b> in the <b>UAT</b> environment.<br>
                                      Unfortunately, the deployment encountered errors. Attached to this email are the deployment logs for your review.<br><br><br>
                                      
                                      Best regards,<br>
                                      DevOps Team <br>
                                      Debut Infotech""",
                                      to: "prc@debutinfotech.com",
                                      from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                                      mimeType: 'text/html'
                        } else {
                            emailext subject: "UAT Deployment Successful",
                                      body: """This is an automated notification regarding the recent deployment of <b>PRC ICO-API</b> in the <b>UAT</b> environment.
                                           The deployment process has completed successfully. The latest version of the application has been successfully deployed, and the system is now running as expected.
                                           
                                           Best regards, 
                                           DevOps Team 
                                           Debut Infotech""",
                                      to: "prc@debutinfotech.com",
                                      from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                                      mimeType: 'text/html'
                        }
                    }
                }
            }
        }
    }
    
    post {
        unstable {
            emailext subject: "Quality Gate Not Passed",
                      body: """After conducting a thorough review, we regret to inform you that the code did not meet the quality gate expectations outlined for our project.
                            We understand that meeting quality gate expectations can sometimes be challenging, especially when working under tight deadlines or facing complex requirements. 
                            However, maintaining code quality is paramount to the success of our project and the satisfaction of our users.<br><br><br><br>
                            
                            Best regards,
                            DevOps Team<br>
                            Debut Infotech""",
                      to: "prc@debutinfotech.com",
                      from: "Debut Infotech DevOps Team <devops@debutinfotech.com>",
                      mimeType: 'text/html'
        }
    }
}
