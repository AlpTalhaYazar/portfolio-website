import { describe, expect, it } from "vitest";
import { withNodeEnv } from "./validate-env";

describe("withNodeEnv", () => {
  it("sets NODE_ENV for the duration of the callback and restores it afterwards", async () => {
    const mutableEnv = process.env as Record<string, string | undefined>;
    delete mutableEnv.NODE_ENV;

    const seen = await withNodeEnv("production", async () => process.env.NODE_ENV);

    expect(seen).toBe("production");
    expect(process.env.NODE_ENV).toBeUndefined();
  });

  it("restores the previous NODE_ENV value after the callback finishes", async () => {
    const mutableEnv = process.env as Record<string, string | undefined>;
    mutableEnv.NODE_ENV = "test";

    const seen = await withNodeEnv("production", async () => process.env.NODE_ENV);

    expect(seen).toBe("production");
    expect(process.env.NODE_ENV).toBe("test");
  });
});
