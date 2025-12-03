

import { describe, expect, it } from "@effect/vitest";
import { Effect, pipe } from "effect";
import { parse, process } from "./one.js"

const sample = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;

describe("Part one", () => {
  describe("sample", () => {
    const parsed = Effect.runSync(parse(sample))
    it("parse", () => {
      expect(
        parsed
      ).toEqual(
        [[11, 22], [95, 115], [998, 1012], [1188511880, 1188511890], [222220, 222224], [1698522, 1698528], [446443, 446449], [38593856, 38593862], [565653, 565659], [824824821, 824824827], [2121212118, 2121212124]]
      );
    });

    const processed = process(parsed);
    it("process", () => {
      expect(
        processed
      ).toEqual(
        [11, 22, 99, 1010, 1188511885, 222222, 446446, 38593859]
      );
    });

    const sum = processed.reduce((a, b) => a + b)
    it("sum", () => {
      const answer = 1227775554;
      expect(
        sum
      ).toBe(
        answer
      )
    })

  })

  it("solves", () => {
    const input = "245284-286195,797927-983972,4949410945-4949555758,115-282,8266093206-8266228431,1-21,483873-655838,419252-466133,6190-13590,3876510-4037577,9946738680-9946889090,99954692-100029290,2398820-2469257,142130432-142157371,9797879567-9798085531,209853-240025,85618-110471,35694994-35766376,4395291-4476150,33658388-33694159,680915-772910,4973452995-4973630970,52-104,984439-1009605,19489345-19604283,22-42,154149-204168,7651663-7807184,287903-402052,2244-5558,587557762-587611332,307-1038,16266-85176,422394377-422468141";
    const answer = 54234399924;

    expect(
      Effect.runSync(Effect.gen(function* () {
        return pipe(
          yield* parse(input),
          process,
        ).reduce((a, b) => a + b)
      }))
    ).toBe(answer)
  })
})

describe("Part two", () => {
  describe("sample", () => {
    const parsed = Effect.runSync(parse(sample))
    it("parse", () => {
      expect(
        parsed
      ).toEqual(
        [[11, 22], [95, 115], [998, 1012], [1188511880, 1188511890], [222220, 222224], [1698522, 1698528], [446443, 446449], [38593856, 38593862], [565653, 565659], [824824821, 824824827], [2121212118, 2121212124]]
      );
    });

    const processed = process(parsed);
    it("process", () => {
      expect(
        processed
      ).toEqual(
        [11, 22, 99, 111, 999, 1010, 1188511885, 222222, 446446, 38593859, 565656, 824824824, 2121212121]
      );
    });

    const sum = processed.reduce((a, b) => a + b)
    it("sum", () => {
      const answer = 4174379265;
      expect(
        sum
      ).toBe(
        answer
      )
    })
  })
})
