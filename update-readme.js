import { readFileSync, writeFileSync } from "node:fs";
import https from "node:https";

function fetchURL() {
    return new Promise((resolve, reject) => {
        https
            .get("https://pget.vercel.app/", (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk.toString();
                });

                res.on("end", () => {
                    let cleaned = data.trim();

                    try {
                        const parsed = JSON.parse(cleaned);
                        cleaned = parsed.url ?? cleaned;
                    } catch {
                        // not JSON → continue
                    }

                    cleaned = cleaned.replace(/^"(.*)"$/, "$1");

                    resolve(cleaned);
                });
            })
            .on("error", reject);
    });
}

async function main() {
    try {
        const url = await fetchURL();
        const readme = readFileSync("README.md", "utf-8");
        let updatedReadme = readme;

        updatedReadme = updatedReadme.replace(/\[Portfolio\]\(.*?\)/, `[Portfolio](${url.portfolio})`);
        updatedReadme = updatedReadme.replace(/\[GitHub\]\(.*?\)/, `[GitHub](${url.github})`);
        updatedReadme = updatedReadme.replace(/\[LinkedIn\]\(.*?\)/, `[LinkedIn](${url.linkedin})`);
        updatedReadme = updatedReadme.replace(/\[Twitter\]\(.*?\)/, `[Twitter](${url.twitter})`);

        writeFileSync("README.md", updatedReadme);
        console.log("Updated README with:", url);
    } catch (err) {
        console.error("Error:", err);
        process.exitCode = 1;
    }
}

void main();