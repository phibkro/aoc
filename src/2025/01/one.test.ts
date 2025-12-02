import { describe, expect, it } from "@effect/vitest";
import { Effect, Equal, pipe } from "effect";
import { scan, reduce, parse, rotate } from "./one.js"

describe("Part one", () => {
  describe("sample", () => {
    const sample = `
  L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
  `;

    const answer = 3;

    it("extract operations", () => {
      expect(
        Effect.runSync(parse(sample))
      ).toEqual(
        [-68, -30, 48, -5, 60, -55, -1, -99, 14, -82]
      );
    });

    it("rotations applied", () => {
      expect(
        pipe(
          Effect.runSync(parse(sample)),
          rotate
        )
      ).toEqual(
        [82, 52, 0, 95, 55, 0, 99, 0, 14, 32]
      );
    });

    it("sum of 0s", () => {
      expect(
        Effect.runSync(Effect.gen(function* () {
          const s = yield* parse(sample);
          const x = rotate(s);
          return reduce(x);
        }))
      ).toBe(
        answer
      )
    })
  })
})
