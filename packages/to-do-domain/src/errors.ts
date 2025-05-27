export class TooManyRequestsError extends Error {
  readonly _tag = "TooManyRequestsError";
}

export class ItemAlreadyExists extends Error {
  readonly _tag = "ItemAlreadyExistss";
}

export class ItemNotFound extends Error {
  readonly _tag = "ItemNotFound";
}
