const log = console.log;

const fs = require("fs");
const https = require("https");
const { promisify } = require("util");

const owner = "MaxWebJS";
const repo = "GitHub_api_test";
const path = "test1.txt";
const accessToken = "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"; // Replace with your GitHub access token

const readFileAsync = promisify(fs.readFile);

// Function to update the file on GitHub
const updateFileOnGitHub = async () => {
	try {
		// Read the local file
		const localContent = await readFileAsync("test1.txt", "utf-8");

		const updatedContent = localContent;

		// Encode the updated content to Base64
		const encodedContent = Buffer.from(updatedContent).toString("base64");

		// Fetch the current content and SHA from GitHub
		const options = {
			hostname: "api.github.com",
			path: `/repos/${owner}/${repo}/contents/${path}`,
			method: "GET",
			headers: {
				Authorization: `token ${accessToken}`,
				"User-Agent": "node.js",
			},
		};

		const response = await new Promise((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					resolve(JSON.parse(data));
				});
			});

			req.on("error", (error) => {
				reject(error);
			});

			req.end();
		});

		// Update the file on GitHub
		const updateOptions = {
			hostname: "api.github.com",
			path: `/repos/${owner}/${repo}/contents/${path}`,
			method: "PUT",
			headers: {
				Authorization: `token ${accessToken}`,
				"Content-Type": "application/json",
				"User-Agent": "node.js",
			},
		};

		const updateResponse = await new Promise((resolve, reject) => {
			const req = https.request(updateOptions, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					resolve(JSON.parse(data));
				});
			});

			req.on("error", (error) => {
				reject(error);
			});

			req.write(
				JSON.stringify({
					message: "Update file",
					content: encodedContent,
					sha: response.sha,
				})
			);

			req.end();
		});

		console.log("File updated:", updateResponse);
	} catch (error) {
		console.error("Error:", error);
	}
};

// Watch for changes in the file using fs.watch
fs.watch("test1.txt", (eventType, filename) => {
	if (eventType === "change") {
		console.log(`File ${filename} has been changed`);
		updateFileOnGitHub();
	}
});

console.log("Watching for changes in test1.txt...");
