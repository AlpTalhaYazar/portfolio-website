#!/usr/bin/env tsx

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "dotenv";

const repoRoot = process.cwd();
const sourceFile = join(repoRoot, ".env.production.local");
const targetFile = join(repoRoot, ".env.production");
const dotenvxBinary = join(repoRoot, "node_modules", ".bin", "dotenvx");

function main(): void {
  if (!existsSync(dotenvxBinary)) {
    throw new Error("dotenvx is not installed. Run `npm install` first.");
  }

  if (!existsSync(sourceFile)) {
    throw new Error(
      "Missing .env.production.local. Create it locally before syncing the encrypted production file."
    );
  }

  const parsedEntries = Object.entries(
    parse(readFileSync(sourceFile, "utf8"))
  );

  if (parsedEntries.length === 0) {
    throw new Error(".env.production.local does not contain any variables.");
  }

  writeFileSync(targetFile, "", "utf8");

  for (const [key, value] of parsedEntries) {
    execFileSync(dotenvxBinary, ["set", key, value, "-f", targetFile], {
      cwd: repoRoot,
      stdio: "pipe",
    });
  }

  console.log(
    `Encrypted ${parsedEntries.length} variables into .env.production.`
  );
  console.log(
    "Private decryption material stays in .env.keys locally and must not be committed."
  );
}

main();
