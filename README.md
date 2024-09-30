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
