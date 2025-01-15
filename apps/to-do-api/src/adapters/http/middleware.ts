import * as H from "@pagopa/handler-kit";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";
import { Decoder } from "io-ts";

/**
 * Parses the request body using a specified io-ts schema and validates it.
 *
 * This function takes a JSON schema decoder and an HTTP request, then attempts to
 * parse and validate the request body against the schema.
 * If the validation fails, it returns an {@link H.HttpBadRequestError} with an
 * appropriate message.
 */
export const parseRequestBody =
  <T>(schema: Decoder<unknown, T>) =>
  (req: H.HttpRequest) =>
    pipe(
      req.body,
      H.parse(schema),
      E.mapLeft(() => new H.HttpBadRequestError("Missing or invalid body")),
    );

/**
 * Parses a specific path parameter of an HTTP request using the provided schema.
 */
export const parsePathParameter =
  <T>(schema: Decoder<unknown, T>, paramName: string) =>
  (req: H.HttpRequest) =>
    pipe(
      req.path[paramName],
      H.parse(schema, `Invalid format of ${paramName} parameter`),
      E.mapLeft(({ message }) => new H.HttpBadRequestError(message)),
    );
