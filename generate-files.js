import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import ora from 'ora';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import chalkAnimation from 'chalk-animation'

const apikey = process.env.GEMINI_API_KEY;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(apikey);

if (!genAI) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables')
}

// Create readline interface for input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(query, isMandatory = false) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(chalk.cyan(query), (answer) => {
        if (isMandatory && !answer) {
          console.log(
            chalk.red("\n 🚨 This question is mandatory. Please provide an answer. \n")
          );
          ask(); // Ask again if the answer is empty and the question is mandatory
        } else {
          resolve(answer); // Resolve with the answer, even if it's empty for non-mandatory questions
        }
      });
    };
    ask(); // Start asking
  });
}

// Function to get AI-generated content
async function getAIContent(prompt, userInputs) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        }
    ],
  });

  const fullPrompt = `
    Based on the following user inputs:
    ${Object.entries(userInputs).map(([key, value]) => `${key}: ${value}`).join('\n')}

    ${prompt}
  `;

  const result = await model.generateContent(fullPrompt);
  return result.response.text();
}

// Define folder structure
const githubFolder = path.join(process.cwd(), ".github");
const discussionTemplateFolder = path.join(githubFolder, "DISCUSSION_TEMPLATE");
const issueTemplateFolder = path.join(githubFolder, "ISSUE_TEMPLATE");

const pullRequestTemplate = path.join(githubFolder, "PULL_REQUEST_TEMPLATE.md");
const fundingTemplate = path.join(githubFolder, "FUNDING.yml");
const securityTemplate = path.join(githubFolder, "SECURITY.md");

const docsFolder = path.join(process.cwd(), "docs");
const contributingTemplate = path.join(docsFolder, "CONTRIBUTING.md");
const governanceTemplate = path.join(docsFolder, "GOVERNANCE.md");
const supportTemplate = path.join(docsFolder, "SUPPORT.md");
const codeOfConductTemplate = path.join(docsFolder, "CODE_OF_CONDUCT.md");

const files = {
  // files related to DISCUSSION_TEMPLATE
  announcements: path.join(discussionTemplateFolder, "ANNOUNCEMENTS.yml"),
  ideas: path.join(discussionTemplateFolder, "IDEAS.yml"),

  // files related to ISSUE_TEMPLATE
  bugReport: path.join(issueTemplateFolder, "BUG_REPORT.yml"),
  featureRequest: path.join(issueTemplateFolder, "FEATURE_REQUEST.md"),
  enhancementRequest: path.join(issueTemplateFolder, "ENHANCEMENT_REQUEST.yml"),
  question: path.join(issueTemplateFolder, "QUESTION.md"),
  config: path.join(issueTemplateFolder, "config.yml")
};

// Ensure the necessary folders exist
if (!fs.existsSync(githubFolder)) {
  fs.mkdirSync(githubFolder);
}
if (!fs.existsSync(discussionTemplateFolder)) {
  fs.mkdirSync(discussionTemplateFolder);
}
if (!fs.existsSync(issueTemplateFolder)) {
  fs.mkdirSync(issueTemplateFolder);
}
if (!fs.existsSync(docsFolder)) {
  fs.mkdirSync(docsFolder);
}

// Function to create files with content
async function createFiles() {
  // Message to the user
  console.log(chalk.bgBlue.white("\n=========================================="));
  console.log(chalk.bgBlue.white("      [❗] – Questions are mandatory     "));
  console.log(chalk.bgBlue.white("==========================================\n"));

  // Get user inputs for templates
  const authorName = await askQuestion(
    "❗ What is the repository owner's name?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const projectLicense = await askQuestion(
    "❗ What is the project license? (e.g., MIT, Apache, GPL):\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const bugAssignee = await askQuestion(
    "❗ Whom would you like to assign the raised bugs to?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const enhancementAssignee = await askQuestion(
    "❗ Who should be assigned the enhancement requests?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const featureAssignee = await askQuestion(
    "❗ To whom would you like to assign the feature requests?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const questionAssignee = await askQuestion(
    "❗ Who will be responsible for addressing questions related to the project?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const orgName = await askQuestion(
    "❗ What is your organization name?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const socialMedia = await askQuestion(
    "❗ What is your social media URL to connect?\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const email = await askQuestion(
    "❗ Please provide the email address for developers and contributors to contact you:\n➜ ",
    true
  );
  console.log("\n·················································· \n");
  const githubUsername = await askQuestion(
    "Please provide the GitHub username(s) for funding (comma separated) or leave blank if none:\n➜ ",
    false
  );
  console.log("\n·················································· \n");
  const patreonUsername = await askQuestion(
    "Enter the Patreon username for funding (leave blank if none):\n➜ ",
    false
  );
  console.log("\n·················································· \n");
  const tideliftPackage = await askQuestion(
    "Enter the Tidelift package name (e.g., npm/package-name) for funding (leave blank if none):\n➜ ",
    false
  );
  console.log("\n·················································· \n");
  const customFunding = await askQuestion(
    "Enter any custom funding URLs (comma separated) or leave blank if none:\n➜ ",
    false
  );

  // Close the readline interface
  rl.close();

  // Process the inputs
  const githubUsers = githubUsername.split(",").map((user) => user.trim());
  const customUrls = customFunding.split(",").map((url) => url.trim());

  // Collect all user inputs in an object
  const userInputs = {
    authorName,
    projectLicense,
    bugAssignee,
    enhancementAssignee,
    featureAssignee,
    questionAssignee,
    orgName,
    socialMedia,
    email,
    githubUsername: githubUsers.join(", "),
    patreonUsername,
    tideliftPackage,
    customFunding: customUrls.join(", ")
  };

  // Use spinners for AI-generated content
  const spinner = ora('Generating AI content...').start();

  // Generate AI content for each template, passing the userInputs
  const announcementsContent = await getAIContent("Generate a YAML template for project announcements", userInputs);
  const ideasContent = await getAIContent("Generate a YAML template for project ideas", userInputs);
  const bugReportContent = await getAIContent("Generate a YAML template for bug reports", userInputs);
  const featureRequestContent = await getAIContent("Generate a markdown template for feature requests", userInputs);
  const enhancementRequestContent = await getAIContent("Generate a YAML template for enhancement requests", userInputs);
  const questionContent = await getAIContent("Generate a markdown template for project questions", userInputs);
  const configContent = await getAIContent("Generate a YAML config file for GitHub issues", userInputs);
  const pullRequestTemplateContent = await getAIContent("Generate a markdown template for pull requests", userInputs);
  const fundingTemplateContent = await getAIContent("Generate a YAML template for project funding", userInputs);
  const securityTemplateContent = await getAIContent("Generate a markdown template for security policy", userInputs);
  const contributingTemplateContent = await getAIContent("Generate a markdown template for contribution guidelines", userInputs);
  const governanceTemplateContent = await getAIContent("Generate a markdown template for project governance", userInputs);
  const supportTemplateContent = await getAIContent("Generate a markdown template for project support", userInputs);
  const codeOfConductTemplateContent = await getAIContent("Generate a markdown template for code of conduct", userInputs);

  spinner.succeed('AI content generated successfully');

  // Write content to files
  fs.writeFileSync(files.announcements, announcementsContent);
  fs.writeFileSync(files.ideas, ideasContent);
  fs.writeFileSync(files.bugReport, bugReportContent);
  fs.writeFileSync(files.featureRequest, featureRequestContent);
  fs.writeFileSync(files.enhancementRequest, enhancementRequestContent);
  fs.writeFileSync(files.question, questionContent);
  fs.writeFileSync(files.config, configContent);
  fs.writeFileSync(pullRequestTemplate, pullRequestTemplateContent);
  fs.writeFileSync(fundingTemplate, fundingTemplateContent);
  fs.writeFileSync(securityTemplate, securityTemplateContent);
  fs.writeFileSync(contributingTemplate, contributingTemplateContent);
  fs.writeFileSync(governanceTemplate, governanceTemplateContent);
  fs.writeFileSync(supportTemplate, supportTemplateContent);
  fs.writeFileSync(codeOfConductTemplate, codeOfConductTemplateContent);

  const repoLink = "https://github.com/perfect7613";

  console.log(
    chalkAnimation.rainbow("\n⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆")
  );
  console.log("\n");
  console.log(chalk.green.bold("Community health files setup has been done successfully! ✅"));
  console.log("\n");
  console.log(
    chalk.yellow(`If you appreciate my efforts, please consider supporting me by ⭐ my repository on GitHub: ${repoLink}`)
  );
  console.log("\n");
  console.log(
    chalkAnimation.rainbow("⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆⋆⋅☆⋅⋆\n")
  );
}

// Execute file creation
createFiles().catch((err) => console.error(chalk.red(err)));