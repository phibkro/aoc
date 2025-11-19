import { describe, expect, it } from "@effect/vitest"
import { Equal } from "effect";
import { transform, reduce } from "./part-one.js"

describe("Part one", () => {
  const sample = `
  3   4
  4   3
  2   5
  1   3
  3   9
  3   3
  `;

  const answer = 11;

  it("should transform", () => {
    expect(Equal.equals(
      transform(sample),
      [[3, 4], [4, 3], [2, 5], [1, 3], [3, 9], [3, 3]]
    ));
  });

  it("should reduce", () => {
    expect(
      reduce(transform(sample)) === answer,
    )
  })
})
