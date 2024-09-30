
# AI-Powered Community Health File Generator

![Project Logo](./assets/autorepodocs-logo.png)

This project is an AI-powered tool designed to generate community health files for repositories. It supports multiple AI platforms including OpenAI (GPT-4), Google Gemini, and Anthropic's Claude. Using the selected platform, it generates various repository templates such as issue templates, pull request templates, and more.

## Features

- **Multi-platform AI support**: Choose between OpenAI, Google Gemini, and Anthropic Claude for content generation.
- **Automated file generation**: Automatically generates essential community health files, including:
  - Issue templates (e.g., Bug Reports, Feature Requests)
  - Discussion templates (e.g., Announcements, Ideas)
  - Pull Request templates
  - Funding information
  - Security policy
  - Contribution guidelines
  - Governance documents
  - Code of Conduct
- **Interactive CLI**: A user-friendly, interactive command-line interface that prompts for necessary inputs.
- **Parallel AI requests**: Speed up content generation using concurrent API requests.
- **Customizable**: Supports user-defined fields like assignees for issues and feature requests, license information, and more.

## Table of Contents

- [Installation](#installation)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Available AI Platforms](#available-ai-platforms)
- [Generated Files](#generated-files)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-community-health.git
   cd ai-community-health

2. Install the dependencies:

   ```bash
   npm install

## Requirements
  - Node.js (v14 or above)
  - NPM (or Yarn)
  - API keys from any of the supported platforms:
    - OpenAI API Key
    - Google Gemini API Key
    - Anthropic Claude API Key
   

## Setup
Before you start using the tool, ensure that you have an API key from one of the supported platforms. When prompted by the CLI, you will need to provide the key.

If you wish to set up the key as an environment variable (optional), you can do so as follows:

    ```bash
    export OPENAI_API_KEY=your_openai_api_key
    export GEMINI_API_KEY=your_gemini_api_key
    export CLAUDE_API_KEY=your_claude_api_key

Alternatively, the CLI will prompt you for the API key during runtime.


## Usage
To run the project and start generating the community health files, follow these steps:

1. Start the CLI tool:
   ```bash
   node index.js

2. You will be prompted to select one of the AI platforms:
    - OpenAI 
    - Google Gemini
    - Anthropic Claude
       
3. Enter your API key for the selected platform when prompted.
4. Answer the subsequent questions about your repository (e.g., owner name, license type, assignees for issue templates, etc.).
5. The tool will generate the following files within the appropriate directories of your repository.
Once completed, the generated files will be available in the `.github` and `docs` directories.

## Available AI Platforms
This tool supports three major AI platforms for generating content:

## 1. OpenAI (GPT-4)
  - Requires an OpenAI API key.
  - Generates content using the GPT-4 model.
    
## 2. Google Gemini
  - Requires a Google Gemini API key.
  - Utilizes Google's generative AI services with customizable safety settings.

## 3. Anthropic Claude
  - Requires a Claude API key from Anthropic.
  - Claude is designed to generate safe and useful AI content.

## Generated Files
The tool generates the following community health files:
## - Issue Templates
  - `BUG_REPORT.yml`: Template for users to report bugs.
  - `FEATURE_REQUEST.md`: Template for feature requests.
  - `ENHANCEMENT_REQUEST.yml`: Template for enhancements.
  - `QUESTION.md`: Template for general questions.
  - `config.yml`: Configuration for issue templates.
## - Discussion Templates
  - `ANNOUNCEMENTS.yml`: Template for announcements.
  - `IDEAS.yml`: Template for idea submissions.
## Pull Request Template
  - `PULL_REQUEST_TEMPLATE.md`: A markdown template for creating pull requests.
## Funding Information
  - `FUNDING.yml`: Information about funding sources (e.g., GitHub Sponsors, Patreon).
## Security Policy
  - `SECURITY.md`: Guidelines and policies for handling security vulnerabilities.
## Contribution Guidelines
  - `CONTRIBUTING.md`: Guidelines for contributing to the repository.
## Governance
  - `GOVERNANCE.md`: Information about the governance structure of the project.
## Support Information
  - `SUPPORT.md`: Details about how to seek support or ask questions.
## Code of Conduct
  - `CODE_OF_CONDUCT.md`: A code of conduct for contributors to the project.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing
We welcome contributions! Please feel free to submit a pull request or open an issue to help improve this tool.

## Support
If you have any questions, feel free to open an issue or reach out through GitHub Discussions.

    ```bash
    You can copy and paste this directly into your project’s `README.md` file. Be sure to replace `yourusername` with your actual GitHub username       in the links!
