import { FileSystem, Path } from "@effect/platform"
// import { NodeContext as Context, NodeRuntime as Runtime } from "@effect/platform-node"
import { BunContext as Context, BunRuntime as Runtime } from "@effect/platform-bun"
import { Effect, pipe, Schema } from "effect"

const output = Schema.NonEmptyArray(
  Schema.Tuple(
    Schema.NumberFromString,
    Schema.NumberFromString
  )
);

const splitNewLine = Schema.decodeUnknownSync(Schema.split("\n"));
const trim = Schema.decodeUnknownSync(Schema.Trim);
const splitWhiteSpace = Schema.decodeUnknownSync(Schema.split("   "));
const numberFromString = Schema.decodeUnknownSync(Schema.NumberFromString);

export function transform(txt: string) {
  return pipe(
    txt,
    splitNewLine,
    (lines) => lines.filter(line => trim(line)),
    (lines) => lines.map((line) =>
      pipe(
        line,
        trim,
        splitWhiteSpace,
        (tuple) => tuple.map((str) => numberFromString(str))
      )
    ),
  );
};

const program = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;
  const txt = yield* fs.readFileString(
    path.join(
      import.meta.dirname,
      "part-one.txt"),
    "utf-8"
  );

  console.log(transform(txt));
});

if (import.meta.main) {
  Runtime.runMain(
    pipe(
      program,
      Effect.provide(Context.layer)),
  )
}
