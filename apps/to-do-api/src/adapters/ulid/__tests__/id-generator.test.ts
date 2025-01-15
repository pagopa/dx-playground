import { describe, expect, it } from "vitest";

import { makeTaskIdGenerator } from "../id-generator.js";

describe("TaskIdGenerator", () => {
  const taskIdGenerator = makeTaskIdGenerator();
  const firstId = taskIdGenerator.generate();
  const secondId = taskIdGenerator.generate();

  it("should produce different ids", () => {
    expect(firstId).not.toStrictEqual(secondId);
  });
  it("should produce ordered ids", () => {
    expect(firstId < secondId).toStrictEqual(true);
  });
});
