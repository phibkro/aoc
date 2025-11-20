import { FileSystem, Path } from "@effect/platform"
// import { NodeContext as Context, NodeRuntime as Runtime } from "@effect/platform-node"
import { BunContext as Context, BunRuntime as Runtime } from "@effect/platform-bun"
import { Effect, pipe, Schema } from "effect"

const NewLine = Schema.split("\n");
const Separator = Schema.split("   ");

const RemoveEmptyStrings = Schema.transform(
  Schema.Array(Schema.String),
  Schema.Array(Schema.NonEmptyString),
  {
    strict: true,
    decode: (items) => items.map(s => s.trim()).filter(s => s.length > 0),
    encode: (items) => items // encode back unchanged (no-op)
  }
)

const lines = Schema.asSchema(
  pipe(
    Schema.String,
    Schema.compose(NewLine),
    Schema.compose(RemoveEmptyStrings)
  ));

const vec2d = Schema.asSchema(
  pipe(
    Schema.String,
    Schema.compose(Separator),
    Schema.compose(
      Schema.Tuple(Schema.NumberFromString, Schema.NumberFromString),
    )
  ));

const vec2dArray = Schema.asSchema(Schema.compose(
  lines,
  Schema.NonEmptyArray(vec2d)
));

export const transform = Schema.decodeUnknown(vec2dArray);

export function reduce(lines: typeof vec2dArray.Type) {
  const tuples = lines.flatMap((line) => Math.abs(line[0] - line[1]));
  const sum = tuples.reduce((acc, curr) => acc + curr);
  return sum;
}

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const txt = yield* fs.readFileString(
    path.join(
      import.meta.dirname,
      "part-one.txt"),
    "utf-8"
  );

  const lines = yield* transform(txt);

  console.log(reduce(lines))
});

if (import.meta.main) {
  Runtime.runMain(
    pipe(
      program,
      Effect.provide(Context.layer)),
  )
}
