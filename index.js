#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Global variables for platform and API key
let selectedPlatform;
let apiKey;

// Initialize readline interface for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to ask a question
async function askQuestion(query, isMandatory = false) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(chalk.cyan(query), (answer) => {
        if (isMandatory && !answer) {
          console.log(chalk.red("\n 🚨 This question is mandatory. Please provide an answer. \n"));
          ask(); // Ask again if mandatory and empty
        } else {
          resolve(answer.trim());
        }
      });
    };
    ask();
  });
}

// Function to select AI platform
async function selectPlatform() {
  selectedPlatform = await askQuestion("❗ Which AI platform would you like to use? (openai/gemini/claude): ", true);
  while (!['openai', 'gemini', 'claude'].includes(selectedPlatform.toLowerCase())) {
    console.log(chalk.red("\n 🚨 Invalid platform. Please choose openai, gemini, or claude. \n"));
    selectedPlatform = await askQuestion("❗ Which AI platform would you like to use? (openai/gemini/claude): ", true);
  }

  apiKey = await askQuestion(`❗ Please enter your ${selectedPlatform.toUpperCase()} API key: `, true);
}

// Function to generate AI content based on the selected platform
async function getAIContent(prompt, userInputs) {
  const fullPrompt = `Based on the following user inputs:\n${Object.entries(userInputs).map(([key, value]) => `${key}: ${value}`).join('\n')}\n\n${prompt}`;
  switch (selectedPlatform.toLowerCase()) {
    case 'openai':
      return getOpenAIContent(fullPrompt);
    case 'gemini':
      return getGeminiContent(fullPrompt);
    case 'claude':
      return getClaudeContent(fullPrompt);
    default:
      throw new Error('Invalid platform selected');
  }
}

// OpenAI content generation
async function getOpenAIContent(prompt) {
  const openai = new OpenAI({ apiKey });
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
      model: "gpt-4o-mini"
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error during OpenAI completion:", error);
    return "Failed to generate content via OpenAI.";
  }
}

// Google Gemini content generation
async function getGeminiContent(prompt) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE }
    ]
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Anthropic Claude content generation
async function getClaudeContent(prompt) {
  const anthropic = new Anthropic({ apiKey });
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1000,
    temperature: 0,
    system: "You are a helpful assistant. Provide detailed and accurate responses.",
    messages: [{ role: "user", content: prompt }]
  });
  return response.content;
}

// Utility function to ensure necessary directories exist
function ensureDirectoriesExist(directories) {
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Define folder structure
const githubFolder = path.join(process.cwd(), ".github");
const discussionTemplateFolder = path.join(githubFolder, "DISCUSSION_TEMPLATE");
const issueTemplateFolder = path.join(githubFolder, "ISSUE_TEMPLATE");
const docsFolder = path.join(process.cwd(), "docs");

const files = {
  announcements: path.join(discussionTemplateFolder, "ANNOUNCEMENTS.yml"),
  ideas: path.join(discussionTemplateFolder, "IDEAS.yml"),
  bugReport: path.join(issueTemplateFolder, "BUG_REPORT.yml"),
  featureRequest: path.join(issueTemplateFolder, "FEATURE_REQUEST.md"),
  enhancementRequest: path.join(issueTemplateFolder, "ENHANCEMENT_REQUEST.yml"),
  question: path.join(issueTemplateFolder, "QUESTION.md"),
  config: path.join(issueTemplateFolder, "config.yml"),
  pullRequestTemplate: path.join(githubFolder, "PULL_REQUEST_TEMPLATE.md"),
  fundingTemplate: path.join(githubFolder, "FUNDING.yml"),
  securityTemplate: path.join(githubFolder, "SECURITY.md"),
  contributingTemplate: path.join(docsFolder, "CONTRIBUTING.md"),
  governanceTemplate: path.join(docsFolder, "GOVERNANCE.md"),
  supportTemplate: path.join(docsFolder, "SUPPORT.md"),
  codeOfConductTemplate: path.join(docsFolder, "CODE_OF_CONDUCT.md")
};

// Ensure necessary folders exist
ensureDirectoriesExist([githubFolder, discussionTemplateFolder, issueTemplateFolder, docsFolder]);

// Function to collect user inputs for templates
async function collectUserInputs() {
  const userInputs = {};

  // Custom questions for collecting inputs
  userInputs.authorName = await askQuestion("🌟 What is the name of the project owner or maintainer?\n➜ ", true);
  userInputs.projectLicense = await askQuestion("📜 Which license type are you using for this project? (e.g., MIT, Apache 2.0, GPL):\n➜ ", true);
  userInputs.bugAssignee = await askQuestion("🐛 Who should be assigned to manage and fix bugs?\n➜ ", true);
  userInputs.enhancementAssignee = await askQuestion("🔧 Who will handle the requests for feature enhancements?\n➜ ", true);
  userInputs.featureAssignee = await askQuestion("✨ Who will take care of adding new features?\n➜ ", true);
  userInputs.questionAssignee = await askQuestion("❓ Who should address any general or technical questions?\n➜ ", true);
  userInputs.orgName = await askQuestion("🏢 What's the name of your organization or company?\n➜ ", true);
  userInputs.socialMedia = await askQuestion("🔗 Please provide your organization's social media link (e.g., Twitter, LinkedIn):\n➜ ", true);
  userInputs.email = await askQuestion("✉ What's the contact email for developers or contributors?\n➜ ", true);

  // Optional questions
  const githubUsername = await askQuestion("👤 Enter GitHub username(s) for funding, separated by commas (leave blank if none):\n➜ ", false);
  userInputs.githubUsername = githubUsername ? githubUsername.split(',').map(user => user.trim()).join(', ') : '';

  userInputs.patreonUsername = await askQuestion("💰 Enter the Patreon username for funding (leave blank if none):\n➜ ", false);
  userInputs.tideliftPackage = await askQuestion("📦 Provide the Tidelift package name (e.g., npm/package-name) for funding (leave blank if none):\n➜ ", false);

  const customFunding = await askQuestion("🔗 Add any custom funding URLs (comma separated) or leave blank if none:\n➜ ", false);
  userInputs.customFunding = customFunding ? customFunding.split(',').map(url => url.trim()).join(', ') : '';

  return userInputs;
}

// Function to generate files with AI-generated content
async function createFiles() {
  // Wait for platform selection and user inputs before proceeding
  await selectPlatform();
  const userInputs = await collectUserInputs();
  const spinner = ora('Generating AI content...').start();

  // Generate AI content concurrently for all templates
  const [
    announcementsContent, ideasContent, bugReportContent, featureRequestContent, enhancementRequestContent,
    questionContent, configContent, pullRequestTemplateContent, fundingTemplateContent, securityTemplateContent,
    contributingTemplateContent, governanceTemplateContent, supportTemplateContent, codeOfConductTemplateContent
  ] = await Promise.all([
    getAIContent("Generate a YAML template for project announcements", userInputs),
    getAIContent("Generate a YAML template for project ideas", userInputs),
    getAIContent("Generate a YAML template for bug reports", userInputs),
    getAIContent("Generate a markdown template for feature requests", userInputs),
    getAIContent("Generate a YAML template for enhancement requests", userInputs),
    getAIContent("Generate a markdown template for project questions", userInputs),
    getAIContent("Generate a YAML config file for GitHub issues", userInputs),
    getAIContent("Generate a markdown template for pull requests", userInputs),
    getAIContent("Generate a YAML template for project funding", userInputs),
    getAIContent("Generate a markdown template for security policy", userInputs),
    getAIContent("Generate a markdown template for contribution guidelines", userInputs),
    getAIContent("Generate a markdown template for project governance", userInputs),
    getAIContent("Generate a markdown template for project support", userInputs),
    getAIContent("Generate a markdown template for code of conduct", userInputs)
  ]);

  spinner.succeed('AI content generated successfully');

  // Write content to files
  const fileMappings = [
    { file: files.announcements, content: announcementsContent },
    { file: files.ideas, content: ideasContent },
    { file: files.bugReport, content: bugReportContent },
    { file: files.featureRequest, content: featureRequestContent },
    { file: files.enhancementRequest, content: enhancementRequestContent },
    { file: files.question, content: questionContent },
    { file: files.config, content: configContent },
    { file: files.pullRequestTemplate, content: pullRequestTemplateContent },
    { file: files.fundingTemplate, content: fundingTemplateContent },
    { file: files.securityTemplate, content: securityTemplateContent },
    { file: files.contributingTemplate, content: contributingTemplateContent },
    { file: files.governanceTemplate, content: governanceTemplateContent },
    { file: files.supportTemplate, content: supportTemplateContent },
    { file: files.codeOfConductTemplate, content: codeOfConductTemplateContent }
  ];

  fileMappings.forEach(({ file, content }) => {
    try {
      fs.writeFileSync(file, content);
      console.log(chalk.green(`${file} created successfully.`));
    } catch (error) {
      console.error(chalk.red(`Failed to create file: ${file}. Error: ${error.message}`));
    }
  });

  const repoLink = "https://github.com/perfect7613";
  const anotherRepoLink = "https://github.com/aditya305";

  const hyperlink = (text, url) => `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;

  console.log(
    chalk.green.bold("\nCommunity health files setup has been done successfully! ✅")
  );
  console.log(chalk.yellow(`If you appreciate my efforts, please consider supporting us by ⭐ our repositories and following on GitHub: ${hyperlink("Amey Muke", repoLink)} and ${hyperlink("Aditya Sutar", anotherRepoLink)}`));
}

// Execute file creation
createFiles().catch((err) => {
  console.error(chalk.red('Error: '), err);
  process.exit(1);
});
