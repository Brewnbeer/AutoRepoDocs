import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import chalkAnimation from 'chalk-animation';
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
      model: "gpt-4"
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
  userInputs.authorName = await askQuestion("❗ What is the repository owner's name?\n➜ ", true);
  userInputs.projectLicense = await askQuestion("❗ What is the project license? (e.g., MIT, Apache, GPL):\n➜ ", true);
  userInputs.bugAssignee = await askQuestion("❗ Whom would you like to assign the raised bugs to?\n➜ ", true);
  userInputs.enhancementAssignee = await askQuestion("❗ Who should be assigned the enhancement requests?\n➜ ", true);
  userInputs.featureAssignee = await askQuestion("❗ To whom would you like to assign the feature requests?\n➜ ", true);
  userInputs.questionAssignee = await askQuestion("❗ Who will be responsible for addressing questions related to the project?\n➜ ", true);
  userInputs.orgName = await askQuestion("❗ What is your organization name?\n➜ ", true);
  userInputs.socialMedia = await askQuestion("❗ What is your social media URL to connect?\n➜ ", true);
  userInputs.email = await askQuestion("❗ Please provide the email address for developers and contributors to contact you:\n➜ ", true);

  const githubUsername = await askQuestion("Please provide the GitHub username(s) for funding (comma separated) or leave blank if none:\n➜ ", false);
  userInputs.githubUsername = githubUsername ? githubUsername.split(',').map(user => user.trim()).join(', ') : '';

  userInputs.patreonUsername = await askQuestion("Enter the Patreon username for funding (leave blank if none):\n➜ ", false);
  userInputs.tideliftPackage = await askQuestion("Enter the Tidelift package name (e.g., npm/package-name) for funding (leave blank if none):\n➜ ", false);

  const customFunding = await askQuestion("Enter any custom funding URLs (comma separated) or leave blank if none:\n➜ ", false);
  userInputs.customFunding = customFunding ? customFunding.split(',').map(url => url.trim()).join(', ') : '';

  return userInputs;
}

// Function to generate files with AI-generated content
async function createFiles() {
  const spinner = ora('Generating AI content...').start();
  
  // Collect platform and user inputs
  await selectPlatform();
  const userInputs = await collectUserInputs();

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

  console.log(
    chalk.green.bold("\nCommunity health files setup has been done successfully! ✅")
  );
  console.log(chalk.yellow(`If you appreciate my efforts, please consider supporting me by ⭐ my repository on GitHub: ${repoLink}`));
}

// Execute file creation
createFiles().catch((err) => {
  console.error(chalk.red('Error: '), err);
  process.exit(1);
});
