export class ItemAlreadyExists extends Error {
  readonly _tag = "ItemAlreadyExists";
}

export class ItemNotFound extends Error {
  readonly _tag = "ItemNotFound";
}

export class TooManyRequestsError extends Error {
  readonly _tag = "TooManyRequestsError";
}
