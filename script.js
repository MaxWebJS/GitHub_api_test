const log = console.log;
const fs = require("fs");

// Read the local file
// const localContent = fs.readFileSync("test1.txt", "utf-8");

const owner = "MaxWebJS";
const repo = "GitHub_api_test";
const path = "test1.txt";
const accessToken = "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"; // Replace with your GitHub access token

// Step 1: Get the current content of the file
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
	method: "GET",
	headers: {
		Authorization: `token ${accessToken}`,
	},
})
	.then((response) => response.json())
	.then((data) => {
		// Step 2: Decode the Base64-encoded content
		const currentContent = atob(data.content);
		log(currentContent);
		// Step 3: Make changes to the content
		// const updatedContent = currentContent + "\n// Your changes here";
		const updatedContent = localContent;

		// Step 4: Encode the updated content to Base64
		const encodedContent = btoa(updatedContent);

		// Step 5: Update the file
		return fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
			{
				method: "PUT",
				headers: {
					Authorization: `token ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: "Update file",
					content: encodedContent,
					sha: data.sha,
				}),
			}
		);
	})
	.then((response) => response.json())
	.then((data) => console.log("File updated:", data))
	.catch((error) => console.error("Error:", error));
