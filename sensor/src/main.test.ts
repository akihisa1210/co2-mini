import { describe, expect, it } from "vitest";
import { add } from "./main";

describe("main", () => {
  it("add adds numbers", () => {
    expect(add(1, 2)).toEqual(3);
  });
});
