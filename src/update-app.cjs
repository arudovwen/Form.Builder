const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// Replace questionDa and pollApiResponse declarations with the imports
const replacement = `import { demoPollApiResponse, demoQuestionDa } from "./demo-data";

const questionDa = demoQuestionDa;
const pollApiResponse = demoPollApiResponse;
`;

// Regex to find and remove the old const questionDa = [...] and const pollApiResponse = {...}
// Since they span many lines, we can use a more robust replacement strategy.
// Find where `const questionDa = [` starts and where `const pollResultsMap =` starts.

const startIdx = content.indexOf('const questionDa = [');
const endIdx = content.indexOf('const pollResultsMap =');

if (startIdx !== -1 && endIdx !== -1) {
    const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx);
    fs.writeFileSync(appPath, newContent, 'utf8');
    console.log("Successfully updated App.tsx!");
} else {
    console.log("Could not find boundaries.");
}
