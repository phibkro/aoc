import { BunContext, BunRuntime } from "@effect/platform-bun"
import { Effect, pipe, Schema, Option } from "effect"

/* Parsing
  1. Split by ,
  2. Split by -
 */
export const Range = Schema.Tuple(Schema.NumberFromString, Schema.NumberFromString);

const SplitByComma = Schema.split(",");
const SplitByDash = Schema.split("-");

export const Parse = Schema.String.pipe(
  Schema.compose(SplitByComma),
  Schema.compose(Schema.Array(SplitByDash.pipe(
    Schema.compose(Range)
  ))),
);

export const parse = Schema.decode(Parse);

/* Find possible invalid ids for a range */
function isInvalid(id: string) {
  if (id.length % 2 !== 0) return false;

  const half = id.length / 2

  const left = id.substring(0, half);
  const right = id.substring(half);

  return left === right;
}

function invalids(range: typeof Range.Type): Option.Option<number[]> {
  const start = range[0];
  const end = range[1];

  const ids: Array<number> = [];
  for (let i = start; i < end + 1; i++) {
    const el = i.toString()
    if (isInvalid(el)) ids.push(i);
  }

  if (ids.length === 0) return Option.none();

  return Option.some(ids);
}

export const process = (ranges: typeof Parse.Type) => {
  const ids: Array<Array<number>> = [];
  for (const range of ranges) {
    Option.match(invalids(range), {
      onNone: () => null,
      onSome: (value) => ids.push(value),
    })
  }

  return ids.flat();
}

/* Sum all invalid ids */
export const sum = (ids: number[]) => ids.reduce((a, b) => a + b);

const program = Effect.gen(function* () {
  const txt = "245284-286195,797927-983972,4949410945-4949555758,115-282,8266093206-8266228431,1-21,483873-655838,419252-466133,6190-13590,3876510-4037577,9946738680-9946889090,99954692-100029290,2398820-2469257,142130432-142157371,9797879567-9798085531,209853-240025,85618-110471,35694994-35766376,4395291-4476150,33658388-33694159,680915-772910,4973452995-4973630970,52-104,984439-1009605,19489345-19604283,22-42,154149-204168,7651663-7807184,287903-402052,2244-5558,587557762-587611332,307-1038,16266-85176,422394377-422468141";

  const ranges = yield* parse(txt);
  const ids = process(ranges)

  console.log(sum(ids))
});

if (import.meta.main) {
  BunRuntime.runMain(
    pipe(
      program,
      Effect.provide(BunContext.layer)),
  )
}

