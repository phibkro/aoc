import { FileSystem, Path } from "@effect/platform"
// import { NodeContext as Context, NodeRuntime as Runtime } from "@effect/platform-node"
import { BunContext as Context, BunRuntime as Runtime } from "@effect/platform-bun"
import { Effect, ParseResult, pipe, Schema } from "effect"
import { Lines } from "../../utils.js";
import { compose, NumberFromString, TemplateLiteralParser, Union } from "effect/Schema";

/* 
L45\nR4559\n // string input
|
[-45, 4559] // list of ops
|
[5] // list of rotations
*/

/* Scan raw string */

const RotateLeft = TemplateLiteralParser("L", NumberFromString)
const RotateRight = TemplateLiteralParser("R", NumberFromString)

const Statement = Union(RotateLeft, RotateRight);

const StatementsFromText = Schema.asSchema(pipe(
  Lines,
  compose(Schema.Array(Statement))
));

export const scan = Schema.decode(StatementsFromText);

/* Generate ops from statements */

const OpFromStatement = Schema.transform(Statement, Schema.Number, {
  decode: (op) => {
    if (op[0] === "L")
      return -Number(op[1]);
    return Number(op[1]);
  },
  encode: (num) => {
    if (num < 0)
      return ["L", num] as const;

    return ["R", num] as const;
  },
  strict: true,
});

const OpsFromStatements = Schema.asSchema(
  pipe(
    Lines,
    Schema.compose(Schema.Array(OpFromStatement))
  )
)

/* Convert ops to rotations */

const max = 100;
const min = -max;

const Range = Schema.Number.pipe(
  Schema.between(min, max),
);

const Rotate = Schema.transformOrFail(
  Schema.Number,
  Range,
  {
    encode: (num, _, ast) => {
      return ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          num,
          "Can't restore number after transformation"
        )
      )
    },
    decode: (num) => {
      return ParseResult.succeed(num % max);
    },
  });

const RotationsFromInput = Schema.asSchema(pipe(
  OpsFromStatements,
  Schema.compose(Schema.Array(Rotate))
));

export const parse = Schema.decode(RotationsFromInput);

const base = 50;

export const rotate = (ops: readonly number[]) => {
  const list = [base];

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const prev = list[i];
    list.push((prev + op) % max);
  }

  return list.slice(1);
}

export const reduce = (rotations: readonly number[]) => {
  let sum = 0;

  for (const degree of rotations) {
    if (degree === 0) sum++;
  }

  return sum;
}

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const txt = yield* fs.readFileString(
    path.join(
      import.meta.dirname,
      "input.txt"),
    "utf-8"
  );

  const lines = yield* parse(txt);
  const rots = rotate(lines)

  console.log(reduce(rots))
});

if (import.meta.main) {
  Runtime.runMain(
    pipe(
      program,
      Effect.provide(Context.layer)),
  )
}
