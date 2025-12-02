import { pipe, Schema } from "effect";

export const NewLine = Schema.split("\n");

export const RemoveEmptyStrings = Schema.transform(
  Schema.Array(Schema.String),
  Schema.Array(Schema.NonEmptyString),
  {
    strict: true,
    decode: (items) => items.map(s => s.trim()).filter(s => s.length > 0),
    encode: (items) => items // encode back unchanged (no-op)
  }
)

export const Lines = Schema.asSchema(
  pipe(
    Schema.String,
    Schema.compose(NewLine),
    Schema.compose(RemoveEmptyStrings)
  ));
