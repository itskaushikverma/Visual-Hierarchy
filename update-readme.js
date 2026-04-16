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
        const data = JSON.parse(await fetchURL()); // 🔥 FIX HERE
        const readme = readFileSync("README.md", "utf-8");

        let updatedReadme = readme;

        updatedReadme = updatedReadme.replace(/\[Portfolio\]\(.*?\)/, `[Portfolio](${data.portfolio})`);
        updatedReadme = updatedReadme.replace(/\[GitHub\]\(.*?\)/, `[GitHub](${data.github})`);
        updatedReadme = updatedReadme.replace(/\[LinkedIn\]\(.*?\)/, `[LinkedIn](${data.linkedin})`);
        updatedReadme = updatedReadme.replace(/\[Twitter\]\(.*?\)/, `[Twitter](${data.x})`); // ⚠️ key is "x"

        writeFileSync("README.md", updatedReadme);

        console.log("Updated README with:", data);
    } catch (err) {
        console.error("Error:", err);
        process.exitCode = 1;
    }
}

void main();