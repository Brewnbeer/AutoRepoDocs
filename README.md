# AI-Powered Community Health File Generator

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
