export interface Theme {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const themes: Theme[] = [
  // Build & Gestion de Dépendances
  {
    id: 'maven',
    name: 'Maven (Java)',
    category: 'Build & Gestion de Dépendances',
    description: 'Build automation and dependency management for Java projects'
  },
  {
    id: 'gradle',
    name: 'Gradle (Java/Kotlin)',
    category: 'Build & Gestion de Dépendances',
    description: 'Modern build automation tool for Java and Kotlin'
  },
  
  // Test
  {
    id: 'junit',
    name: 'JUnit',
    category: 'Test',
    description: 'Unit testing framework for Java'
  },
  
  // Conteneurisation
  {
    id: 'docker',
    name: 'Docker',
    category: 'Conteneurisation',
    description: 'Platform for developing, shipping, and running applications in containers'
  },
  
  // Orchestration de Conteneurs
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: 'Orchestration de Conteneurs',
    description: 'Container orchestration platform for automating deployment, scaling, and management'
  },
  
  // Infrastructure as Code (IaC)
  {
    id: 'terraform',
    name: 'Terraform',
    category: 'Infrastructure as Code (IaC)',
    description: 'Infrastructure provisioning and management tool'
  },
  {
    id: 'ansible',
    name: 'Ansible',
    category: 'Infrastructure as Code (IaC)',
    description: 'Automation tool for configuration management and application deployment'
  },
  
  // Monitoring & Observabilité
  {
    id: 'prometheus',
    name: 'Prometheus',
    category: 'Monitoring & Observabilité',
    description: 'Open-source monitoring and alerting toolkit'
  },
  
  // Sécurité (DevSecOps)
  {
    id: 'sonarqube',
    name: 'SonarQube',
    category: 'Sécurité (DevSecOps)',
    description: 'Code quality and security analysis platform'
  },
  {
    id: 'trivy',
    name: 'Trivy',
    category: 'Sécurité (DevSecOps)',
    description: 'Vulnerability scanner for containers and other artifacts'
  },
  
  // Cloud Providers
  {
    id: 'aws',
    name: 'AWS',
    category: 'Cloud Providers',
    description: 'Amazon Web Services cloud platform'
  },
  {
    id: 'azure',
    name: 'Azure',
    category: 'Cloud Providers',
    description: 'Microsoft Azure cloud platform'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    category: 'Cloud Providers',
    description: 'Google Cloud Platform services'
  }
];

export const categories = [
  'Build & Gestion de Dépendances',
  'Test',
  'Conteneurisation',
  'Orchestration de Conteneurs',
  'Infrastructure as Code (IaC)',
  'Monitoring & Observabilité',
  'Sécurité (DevSecOps)',
  'Cloud Providers'
];
