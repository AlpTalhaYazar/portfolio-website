#!/usr/bin/env tsx

import { execFileSync as execFileSyncDefault } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "dotenv";

type ExecFileSyncLike = (
  file: string,
  args: string[],
  options: {
    cwd: string;
    stdio: "pipe";
    encoding: BufferEncoding;
  }
) => string;

interface SyncProductionEnvOptions {
  repoRoot?: string;
  sourceFile?: string;
  targetFile?: string;
  envKeysFile?: string;
  dotenvxBinary?: string;
  execFileSync?: ExecFileSyncLike;
}

export function syncProductionEnv({
  repoRoot = process.cwd(),
  sourceFile = join(repoRoot, ".env.production.local"),
  targetFile = join(repoRoot, ".env.production"),
  envKeysFile = join(repoRoot, ".env.keys"),
  dotenvxBinary = join(repoRoot, "node_modules", ".bin", "dotenvx"),
  execFileSync = execFileSyncDefault as ExecFileSyncLike,
}: SyncProductionEnvOptions = {}): { encryptedCount: number } {
  if (!existsSync(dotenvxBinary)) {
    throw new Error("dotenvx is not installed. Run `npm install` first.");
  }

  if (!existsSync(sourceFile)) {
    throw new Error(
      "Missing .env.production.local. Create it locally before syncing the encrypted production file."
    );
  }

  if (!existsSync(envKeysFile)) {
    throw new Error(
      "Missing .env.keys. Keep the private decryption keys locally before syncing the encrypted production file."
    );
  }

  const sourceContents = readFileSync(sourceFile, "utf8");
  const parsedEntries = Object.entries(parse(sourceContents));

  if (parsedEntries.length === 0) {
    throw new Error(".env.production.local does not contain any variables.");
  }

  const tempDirectory = mkdtempSync(join(tmpdir(), "portfolio-dotenvx-sync-"));
  const tempPlaintextFile = join(tempDirectory, ".env.production");
  const tempEncryptedFile = join(tempDirectory, ".env.production.encrypted");

  writeFileSync(tempPlaintextFile, sourceContents, "utf8");

  try {
    const encryptedContents = execFileSync(
      dotenvxBinary,
      ["encrypt", "-f", tempPlaintextFile, "-fk", envKeysFile, "--stdout"],
      {
        cwd: repoRoot,
        stdio: "pipe",
        encoding: "utf8",
      }
    );

    writeFileSync(tempEncryptedFile, encryptedContents, "utf8");
    renameSync(tempEncryptedFile, targetFile);
  } finally {
    rmSync(tempDirectory, { recursive: true, force: true });
  }

  return { encryptedCount: parsedEntries.length };
}

function main(): void {
  const { encryptedCount } = syncProductionEnv();

  console.log(
    `Encrypted ${encryptedCount} variables into .env.production.`
  );
  console.log(
    "Private decryption material stays in .env.keys locally and must not be committed."
  );
}

function isExecutedDirectly(): boolean {
  const currentFile = fileURLToPath(import.meta.url);
  return process.argv[1] === currentFile;
}

if (isExecutedDirectly()) {
  main();
}
