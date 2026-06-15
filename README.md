# <div align="center">⚖️ ADVO — Sistema de Gestão Jurídica Inteligente</div>

<div align="center">
  <p>Uma plataforma premium de alta performance projetada para revolucionar o gerenciamento de escritórios de advocacia, processos judiciais, finanças e tarefas em tempo real.</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 25">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 4.1.0">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-8.0-purple?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/MariaDB-10.x-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB">
  <img src="https://img.shields.io/badge/Flyway-Enabled-red?style=for-the-badge&logo=flyway&logoColor=white" alt="Flyway">
</p>

---

## 📖 Índice

- [📌 Sobre o Projeto](#-sobre-o-projeto)
- [🏛️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
- [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🧩 Módulos e Recursos](#-módulos-e-recursos)
- [📁 Estrutura do Repositório](#-estrutura-do-repositório)
- [🚀 Primeiros Passos](#-primeiros-passos)
  - [Prerequisites](#pré-requisitos)
  - [Configuração do Banco de Dados](#1-configuração-do-banco-de-dados)
  - [Configuração do Back-end](#2-configuração-do-back-end)
  - [Configuração do Front-end](#3-configuração-do-front-end)
  - [Landing Page](#4-landing-page)
- [🛡️ Segurança e Níveis de Acesso (RBAC)](#️-segurança-e-níveis-de-acesso-rbac)
- [📄 Licença](#-licença)

---

## 📌 Sobre o Projeto

O **ADVO** é um sistema **Single-Tenant** robusto, moderno e de alta performance voltado para o controle de rotinas jurídicas. Ele foi estruturado para resolver a sobrecarga administrativa de escritórios jurídicos combinando o poder de processamento do **Java 25** com a velocidade e fluidez de uma interface desenvolvida em **React 19** com **Vite**.

### Principais Diferenciais
- **Visual Dark Premium**: Design minimalista e sofisticado com foco na ergonomia visual e produtividade do advogado.
- **Segurança Avançada**: Controle de sessão e renovação de tokens JWT em tempo real com regras estritas de acesso.
- **Atualizações Otimistas**: Ações na Agenda e no Kanban se refletem instantaneamente, sincronizando silenciosamente com o servidor.
- **Independência de Infraestrutura**: Arquitetura desacoplada que permite migrar banco de dados ou provedores de armazenamento com mínimo esforço.

---

## 🏛️ Arquitetura do Sistema

O back-end do **ADVO** foi projetado seguindo a **Arquitetura Hexagonal** (também conhecida como *Ports & Adapters*). Isso garante o isolamento completo das regras de negócio (Domínio) contra dependências externas de tecnologia (banco de dados, frameworks web, provedores de token, etc.).

### Fluxo de Dependência

```mermaid
graph TD
    subgraph Adaptadores de Entrada (Inbound Adapters)
        WebController[REST API Controllers]
    end

    subgraph Portas de Entrada (Inbound Ports)
        UseCases[Casos de Uso / Use Cases]
    end

    subgraph Núcleo do Domínio (Domain Core)
        DomainServices[Serviços de Domínio]
        Entities[Entidades e Value Objects]
    end

    subgraph Portas de Saída (Outbound Ports)
        RepoPorts[Repository Ports]
        SecurityPorts[Security / Storage Ports]
    end

    subgraph Adaptadores de Saída (Outbound Adapters)
        JPARepo[JPA Persistence Adapter]
        JwtSecurity[JWT Token Provider]
        FileSystem[Local Storage Adapter]
    end

    WebController -->|Chama| UseCases
    UseCases -->|Executa| DomainServices
    DomainServices -->|Manipula| Entities
    DomainServices -->|Usa| RepoPorts
    DomainServices -->|Usa| SecurityPorts
    RepoPorts -->|Implementado por| JPARepo
    SecurityPorts -->|Implementado por| JwtSecurity
    SecurityPorts -->|Implementado por| FileSystem
```

---

## ⚙️ Tecnologias Utilizadas

### Back-end
- **Linguagem**: Java 25 (aproveitando os recursos mais modernos da JVM).
- **Framework**: Spring Boot 4.1.0.
- **Segurança**: Spring Security & JWT (io.jsonwebtoken 0.12.5).
- **Persistência**: Spring Data JPA & Hibernate.
- **Banco de Dados**: MariaDB (Driver MariaDB Java Client).
- **Migrações**: Flyway DB (para versionamento de esquema SQL).
- **Documentação**: Springdoc OpenAPI / Swagger UI (versão 2.8.5).
- **Produtividade**: Project Lombok.

### Front-end
- **Linguagem**: JavaScript (ES6+).
- **Framework**: React 19.2.6 & React DOM.
- **Ferramenta de Build**: Vite 8.0.12.
- **Gerenciamento de Estado**: Zustand 5.0 (leve e reativo).
- **Roteamento**: React Router DOM 7.17.
- **Formulários**: React Hook Form 7.79 com validação Zod.
- **Calendário**: FullCalendar 6.1 (DayGrid, TimeGrid, Interaction).
- **Kanban**: @hello-pangea/dnd (Drag and Drop fluido).
- **Gráficos**: Recharts 3.8.1 (Dashboard financeiro dinâmico).
- **Estilização**: Vanilla CSS com variáveis CSS modernas (sem Tailwind, máxima flexibilidade e controle de performance).

### Landing Page
- Landing Page independente construída com HTML5 puro, CSS3 personalizado com efeito *glassmorphism* e Vanilla JS, projetada para carregar instantaneamente (pontuação de performance máxima no Lighthouse) e otimização para motores de busca (SEO).

---

## 🧩 Módulos e Recursos

O sistema é dividido em **7 módulos essenciais** integrados:

1. **🔐 Segurança & Controle de Acesso (RBAC)**
   - Autenticação stateless robusta através de Access Token (curto prazo) e Refresh Token (longo prazo).
   - Níveis de permissão estritos para diferentes perfis (`ADMIN`, `ADVOGADO`, `ESTAGIARIO`, `SECRETARIA`).
   - Política automática de invalidação de tokens por inatividade (timeout de 15 minutos).

2. **👥 Gestão de Clientes**
   - Cadastro detalhado de Pessoas Físicas (CPF) e Jurídicas (CNPJ).
   - Integração com a API do ViaCEP para preenchimento de endereço em tempo real.
   - Histórico e associação direta de todos os processos do cliente.

3. **📂 Controle Processual (Casos)**
   - Cadastro de processos (número de processo unificado, tribunal, vara, áreas de atuação e partes contrárias).
   - Controle das fases processuais (`Petição Inicial` ➡️ `Instrução` ➡️ `Julgamento` ➡️ `Recurso` ➡️ `Encerrado`).
   - Linha do tempo de movimentações e associação com advogados responsáveis.

4. **📅 Agenda Interativa**
   - Calendário multifuncional para agendar audiências, reuniões, prazos fatais e ordinários.
   - Visualização por mês, semana e dia.
   - Vinculação direta a processos específicos para facilitar a consulta.

5. **📋 Kanban de Tarefas**
   - Painel interativo estilo Kanban para gerenciamento de fluxo de trabalho do escritório.
   - Classificação por prioridades (`Baixa`, `Média`, `Alta`, `Urgente`) e delegação a membros do time.
   - Atualizações em lote usando arrastar e soltar (Drag and Drop).

6. **💾 Gestão de Documentos**
   - Repositório seguro para armazenar procurações, contratos de honorários, petições e ofícios.
   - Associação de arquivos e metadados diretamente a processos para rápida recuperação.
   - Estrutura preparada para expansão com armazenamento em nuvem (S3/Cloud Storage).

7. **📊 Fluxo de Caixa & Financeiro**
   - Lançamentos automatizados de honorários contratuais e taxas processuais.
   - Totalizadores rápidos de receitas, despesas, saldo acumulado e taxas de inadimplência.
   - Gráficos informativos que facilitam a tomada de decisões no escritório.

---

## 📁 Estrutura do Repositório

O projeto é organizado de forma modular em monorrepósito:

```text
advo/
├── advo-backend/          # Back-end Spring Boot (Java 25)
│   ├── src/main/java/     # Estrutura Hexagonal (Domain, Application, Infrastructure)
│   ├── src/main/resources/# Configurações de propriedades e migrações Flyway
│   └── pom.xml            # Configurações de dependências Maven
├── advo-frontend/         # Front-end React SPA
│   ├── src/               # Componentes, Stores (Zustand), Views e Assets
│   ├── package.json       # Script e pacotes Node
│   └── vite.config.js     # Configurações do Vite compiler
├── advo-landing-page/     # Site estático institucional do produto
│   ├── assets/            # Imagens e ícones
│   ├── styles/            # CSS moderno com Glassmorphism
│   ├── scripts/           # Interatividades e simuladores da Landing Page
│   └── index.html         # Estrutura HTML
└── storage/               # Diretório local padrão para upload de documentos
```

---

## 🚀 Primeiros Passos

### Pré-requisitos
Antes de rodar o projeto localmente, certifique-se de possuir:
- **Java JDK 25** instalado e configurado no PATH do sistema.
- **Node.js (versão 18 ou superior)**.
- **MariaDB** ou **MySQL** rodando localmente (porta 3306).
- Um gerenciador de pacotes como **Maven** (opcional, o wrapper `mvnw` está incluso).

---

### 1. Configuração do Banco de Dados

1. Acesse o console do seu banco de dados MariaDB/MySQL e execute o comando para criar a base de dados:
   ```sql
   CREATE DATABASE advo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Caso utilize credenciais diferentes das padrões definidas em `application.yaml` (usuário: `root` e senha: `root_password`), atualize o arquivo no caminho:
   `advo-backend/src/main/resources/application.yaml`

---

### 2. Configuração do Back-end

As migrações da estrutura de tabelas serão gerenciadas e aplicadas automaticamente pelo **Flyway** assim que o projeto inicializar.

1. Navegue para a pasta do back-end:
   ```bash
   cd advo-backend
   ```
2. Instale as dependências e compile o projeto:
   ```bash
   ./mvnw clean install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   ./mvnw spring-boot:run
   ```
4. O back-end estará disponível em **`http://localhost:8045`**.
5. Para acessar e testar a API documentada via Swagger, acesse **`http://localhost:8045/swagger-ui.html`**.

---

### 3. Configuração do Front-end

1. Abra uma nova aba no terminal e navegue para a pasta do front-end:
   ```bash
   cd advo-frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento Vite:
   ```bash
   npm run dev
   ```
4. O painel estará disponível em **`http://localhost:5173`** (ou na porta indicada pelo terminal).

---

### 4. Landing Page

Para testar ou visualizar a Landing Page comercial:
1. Abra o arquivo `advo-landing-page/index.html` diretamente em seu navegador web preferido ou utilize uma extensão como o *Live Server* do VS Code para executá-lo em um servidor local estático.

---

## 🛡️ Segurança e Níveis de Acesso (RBAC)

O ADVO possui uma matriz estrita de segurança para proteger informações processuais confidenciais.

| Módulo/Ação | ADMIN | ADVOGADO | SECRETARIA | ESTAGIARIO |
| :--- | :---: | :---: | :---: | :---: |
| **Registrar Novos Usuários** | ✅ | ❌ | ❌ | ❌ |
| **Configurar Áreas do Direito** | ✅ | ❌ | ❌ | ❌ |
| **Gestão Financeira (Lançamentos)** | ✅ | ✅ | ❌ | ❌ |
| **Upload de Documentos** | ✅ | ✅ | ✅ | ❌ |
| **Gestão de Clientes / CEP** | ✅ | ✅ | ✅ | ✅ (Leitura) |
| **Movimentação Processual** | ✅ | ✅ | ✅ (Visualizar) | ✅ (Visualizar) |
| **Gerenciamento de Kanban** | ✅ | ✅ | ✅ | ✅ |

---

## 📄 Licença

Este projeto é de uso exclusivo para gerenciamento interno. Distribuído sob os termos da licença proprietária de desenvolvimento de software de **Rodolfo Gama**. Todos os direitos reservados.
