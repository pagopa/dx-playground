// DO NOT EDIT THIS FILE
// This file has been generated by gen-api-models
// eslint-disable sonar/max-union-size
// eslint-disable sonarjs/no-identical-functions

import * as t from "io-ts";

import * as r from "@pagopa/ts-commons/lib/requests";

import { ApplicationInfo } from "./ApplicationInfo";

import { CreateTaskItem } from "./CreateTaskItem";

import { TaskItem } from "./TaskItem";

import { ProblemJSON } from "./ProblemJSON";

import { TaskItemList } from "./TaskItemList";

/****************************************************************
 * info
 */

// Request type definition
export type InfoT = r.IGetApiRequestType<
  { readonly ApiKeyAuth: string },
  "Ocp-Apim-Subscription-Key",
  never,
  | r.IResponseType<200, ApplicationInfo, never>
  | r.IResponseType<500, undefined, never>
>;

export const infoDefaultResponses = {
  200: ApplicationInfo,
  500: t.undefined
};

export type InfoResponsesT<
  A0 = ApplicationInfo,
  C0 = ApplicationInfo,
  A1 = undefined,
  C1 = undefined
> = {
  200: t.Type<A0, C0>;
  500: t.Type<A1, C1>;
};

export function infoDecoder<
  A0 = ApplicationInfo,
  C0 = ApplicationInfo,
  A1 = undefined,
  C1 = undefined
>(
  overrideTypes:
    | Partial<InfoResponsesT<A0, C0, A1, C1>>
    | t.Type<A0, C0>
    | undefined = {}
): r.ResponseDecoder<
  r.IResponseType<200, A0, never> | r.IResponseType<500, A1, never>
> {
  const isDecoder = (d: any): d is t.Type<A0, C0> =>
    typeof d["_A"] !== "undefined";

  const type = {
    ...((infoDefaultResponses as unknown) as InfoResponsesT<A0, C0, A1, C1>),
    ...(isDecoder(overrideTypes) ? { 200: overrideTypes } : overrideTypes)
  };

  const d200 = (type[200].name === "undefined"
    ? r.constantResponseDecoder<undefined, 200, never>(200, undefined)
    : r.ioResponseDecoder<
        200,
        typeof type[200]["_A"],
        typeof type[200]["_O"],
        never
      >(200, type[200])) as r.ResponseDecoder<r.IResponseType<200, A0, never>>;

  const d500 = (type[500].name === "undefined"
    ? r.constantResponseDecoder<undefined, 500, never>(500, undefined)
    : r.ioResponseDecoder<
        500,
        typeof type[500]["_A"],
        typeof type[500]["_O"],
        never
      >(500, type[500])) as r.ResponseDecoder<r.IResponseType<500, A1, never>>;

  return r.composeResponseDecoders(d200, d500);
}

// Decodes the success response with the type defined in the specs
export const infoDefaultDecoder = () => infoDecoder();

/****************************************************************
 * createTask
 */

// Request type definition
export type CreateTaskT = r.IPostApiRequestType<
  {
    readonly ApiKeyAuth: string;
    readonly body?: CreateTaskItem | ReadableStream<Uint8Array> | Buffer;
  },
  "Content-Type" | "Ocp-Apim-Subscription-Key",
  never,
  | r.IResponseType<201, TaskItem, never>
  | r.IResponseType<400, ProblemJSON, never>
  | r.IResponseType<500, ProblemJSON, never>
>;

export const createTaskDefaultResponses = {
  201: TaskItem,
  400: ProblemJSON,
  500: ProblemJSON
};

export type CreateTaskResponsesT<
  A0 = TaskItem,
  C0 = TaskItem,
  A1 = ProblemJSON,
  C1 = ProblemJSON,
  A2 = ProblemJSON,
  C2 = ProblemJSON
> = {
  201: t.Type<A0, C0>;
  400: t.Type<A1, C1>;
  500: t.Type<A2, C2>;
};

export function createTaskDecoder<
  A0 = TaskItem,
  C0 = TaskItem,
  A1 = ProblemJSON,
  C1 = ProblemJSON,
  A2 = ProblemJSON,
  C2 = ProblemJSON
>(
  overrideTypes:
    | Partial<CreateTaskResponsesT<A0, C0, A1, C1, A2, C2>>
    | t.Type<A0, C0>
    | undefined = {}
): r.ResponseDecoder<
  | r.IResponseType<201, A0, never>
  | r.IResponseType<400, A1, never>
  | r.IResponseType<500, A2, never>
> {
  const isDecoder = (d: any): d is t.Type<A0, C0> =>
    typeof d["_A"] !== "undefined";

  const type = {
    ...((createTaskDefaultResponses as unknown) as CreateTaskResponsesT<
      A0,
      C0,
      A1,
      C1,
      A2,
      C2
    >),
    ...(isDecoder(overrideTypes) ? { 201: overrideTypes } : overrideTypes)
  };

  const d201 = (type[201].name === "undefined"
    ? r.constantResponseDecoder<undefined, 201, never>(201, undefined)
    : r.ioResponseDecoder<
        201,
        typeof type[201]["_A"],
        typeof type[201]["_O"],
        never
      >(201, type[201])) as r.ResponseDecoder<r.IResponseType<201, A0, never>>;

  const d400 = (type[400].name === "undefined"
    ? r.constantResponseDecoder<undefined, 400, never>(400, undefined)
    : r.ioResponseDecoder<
        400,
        typeof type[400]["_A"],
        typeof type[400]["_O"],
        never
      >(400, type[400])) as r.ResponseDecoder<r.IResponseType<400, A1, never>>;

  const d500 = (type[500].name === "undefined"
    ? r.constantResponseDecoder<undefined, 500, never>(500, undefined)
    : r.ioResponseDecoder<
        500,
        typeof type[500]["_A"],
        typeof type[500]["_O"],
        never
      >(500, type[500])) as r.ResponseDecoder<r.IResponseType<500, A2, never>>;

  return r.composeResponseDecoders(r.composeResponseDecoders(d201, d400), d500);
}

// Decodes the success response with the type defined in the specs
export const createTaskDefaultDecoder = () => createTaskDecoder();

/****************************************************************
 * listTasks
 */

// Request type definition
export type ListTasksT = r.IGetApiRequestType<
  { readonly ApiKeyAuth: string },
  "Ocp-Apim-Subscription-Key",
  never,
  | r.IResponseType<200, TaskItemList, never>
  | r.IResponseType<500, ProblemJSON, never>
>;

export const listTasksDefaultResponses = {
  200: TaskItemList,
  500: ProblemJSON
};

export type ListTasksResponsesT<
  A0 = TaskItemList,
  C0 = TaskItemList,
  A1 = ProblemJSON,
  C1 = ProblemJSON
> = {
  200: t.Type<A0, C0>;
  500: t.Type<A1, C1>;
};

export function listTasksDecoder<
  A0 = TaskItemList,
  C0 = TaskItemList,
  A1 = ProblemJSON,
  C1 = ProblemJSON
>(
  overrideTypes:
    | Partial<ListTasksResponsesT<A0, C0, A1, C1>>
    | t.Type<A0, C0>
    | undefined = {}
): r.ResponseDecoder<
  r.IResponseType<200, A0, never> | r.IResponseType<500, A1, never>
> {
  const isDecoder = (d: any): d is t.Type<A0, C0> =>
    typeof d["_A"] !== "undefined";

  const type = {
    ...((listTasksDefaultResponses as unknown) as ListTasksResponsesT<
      A0,
      C0,
      A1,
      C1
    >),
    ...(isDecoder(overrideTypes) ? { 200: overrideTypes } : overrideTypes)
  };

  const d200 = (type[200].name === "undefined"
    ? r.constantResponseDecoder<undefined, 200, never>(200, undefined)
    : r.ioResponseDecoder<
        200,
        typeof type[200]["_A"],
        typeof type[200]["_O"],
        never
      >(200, type[200])) as r.ResponseDecoder<r.IResponseType<200, A0, never>>;

  const d500 = (type[500].name === "undefined"
    ? r.constantResponseDecoder<undefined, 500, never>(500, undefined)
    : r.ioResponseDecoder<
        500,
        typeof type[500]["_A"],
        typeof type[500]["_O"],
        never
      >(500, type[500])) as r.ResponseDecoder<r.IResponseType<500, A1, never>>;

  return r.composeResponseDecoders(d200, d500);
}

// Decodes the success response with the type defined in the specs
export const listTasksDefaultDecoder = () => listTasksDecoder();

/****************************************************************
 * getTaskById
 */

// Request type definition
export type GetTaskByIdT = r.IGetApiRequestType<
  { readonly ApiKeyAuth: string; readonly taskId: string },
  "Ocp-Apim-Subscription-Key",
  never,
  | r.IResponseType<200, TaskItem, never>
  | r.IResponseType<404, ProblemJSON, never>
  | r.IResponseType<500, ProblemJSON, never>
>;

export const getTaskByIdDefaultResponses = {
  200: TaskItem,
  404: ProblemJSON,
  500: ProblemJSON
};

export type GetTaskByIdResponsesT<
  A0 = TaskItem,
  C0 = TaskItem,
  A1 = ProblemJSON,
  C1 = ProblemJSON,
  A2 = ProblemJSON,
  C2 = ProblemJSON
> = {
  200: t.Type<A0, C0>;
  404: t.Type<A1, C1>;
  500: t.Type<A2, C2>;
};

export function getTaskByIdDecoder<
  A0 = TaskItem,
  C0 = TaskItem,
  A1 = ProblemJSON,
  C1 = ProblemJSON,
  A2 = ProblemJSON,
  C2 = ProblemJSON
>(
  overrideTypes:
    | Partial<GetTaskByIdResponsesT<A0, C0, A1, C1, A2, C2>>
    | t.Type<A0, C0>
    | undefined = {}
): r.ResponseDecoder<
  | r.IResponseType<200, A0, never>
  | r.IResponseType<404, A1, never>
  | r.IResponseType<500, A2, never>
> {
  const isDecoder = (d: any): d is t.Type<A0, C0> =>
    typeof d["_A"] !== "undefined";

  const type = {
    ...((getTaskByIdDefaultResponses as unknown) as GetTaskByIdResponsesT<
      A0,
      C0,
      A1,
      C1,
      A2,
      C2
    >),
    ...(isDecoder(overrideTypes) ? { 200: overrideTypes } : overrideTypes)
  };

  const d200 = (type[200].name === "undefined"
    ? r.constantResponseDecoder<undefined, 200, never>(200, undefined)
    : r.ioResponseDecoder<
        200,
        typeof type[200]["_A"],
        typeof type[200]["_O"],
        never
      >(200, type[200])) as r.ResponseDecoder<r.IResponseType<200, A0, never>>;

  const d404 = (type[404].name === "undefined"
    ? r.constantResponseDecoder<undefined, 404, never>(404, undefined)
    : r.ioResponseDecoder<
        404,
        typeof type[404]["_A"],
        typeof type[404]["_O"],
        never
      >(404, type[404])) as r.ResponseDecoder<r.IResponseType<404, A1, never>>;

  const d500 = (type[500].name === "undefined"
    ? r.constantResponseDecoder<undefined, 500, never>(500, undefined)
    : r.ioResponseDecoder<
        500,
        typeof type[500]["_A"],
        typeof type[500]["_O"],
        never
      >(500, type[500])) as r.ResponseDecoder<r.IResponseType<500, A2, never>>;

  return r.composeResponseDecoders(r.composeResponseDecoders(d200, d404), d500);
}

// Decodes the success response with the type defined in the specs
export const getTaskByIdDefaultDecoder = () => getTaskByIdDecoder();

/****************************************************************
 * deleteTask
 */

// Request type definition
export type DeleteTaskT = r.IDeleteApiRequestType<
  { readonly ApiKeyAuth: string; readonly taskId: string },
  "Ocp-Apim-Subscription-Key",
  never,
  | r.IResponseType<204, undefined, never>
  | r.IResponseType<404, ProblemJSON, never>
  | r.IResponseType<500, ProblemJSON, never>
>;

export const deleteTaskDefaultResponses = {
  204: t.undefined,
  404: ProblemJSON,
  500: ProblemJSON
};

export type DeleteTaskResponsesT<
  A0 = undefined,
  C0 = undefined,
  A1 = ProblemJSON,
  C1 = ProblemJSON,
  A2 = ProblemJSON,
  C2 = ProblemJSON
> = {
  204: t.Type<A0, C0>;
  404: t.Type<A1, C1>;
  500: t.Type<A2, C2>;
};

export function deleteTaskDecoder<
  A0 = undefined,
  C0 = undefined,
  A1 = ProblemJSON,
  C1 = ProblemJSON,
  A2 = ProblemJSON,
  C2 = ProblemJSON
>(
  overrideTypes:
    | Partial<DeleteTaskResponsesT<A0, C0, A1, C1, A2, C2>>
    | t.Type<A0, C0>
    | undefined = {}
): r.ResponseDecoder<
  | r.IResponseType<204, A0, never>
  | r.IResponseType<404, A1, never>
  | r.IResponseType<500, A2, never>
> {
  const isDecoder = (d: any): d is t.Type<A0, C0> =>
    typeof d["_A"] !== "undefined";

  const type = {
    ...((deleteTaskDefaultResponses as unknown) as DeleteTaskResponsesT<
      A0,
      C0,
      A1,
      C1,
      A2,
      C2
    >),
    ...(isDecoder(overrideTypes) ? { 204: overrideTypes } : overrideTypes)
  };

  const d204 = (type[204].name === "undefined"
    ? r.constantResponseDecoder<undefined, 204, never>(204, undefined)
    : r.ioResponseDecoder<
        204,
        typeof type[204]["_A"],
        typeof type[204]["_O"],
        never
      >(204, type[204])) as r.ResponseDecoder<r.IResponseType<204, A0, never>>;

  const d404 = (type[404].name === "undefined"
    ? r.constantResponseDecoder<undefined, 404, never>(404, undefined)
    : r.ioResponseDecoder<
        404,
        typeof type[404]["_A"],
        typeof type[404]["_O"],
        never
      >(404, type[404])) as r.ResponseDecoder<r.IResponseType<404, A1, never>>;

  const d500 = (type[500].name === "undefined"
    ? r.constantResponseDecoder<undefined, 500, never>(500, undefined)
    : r.ioResponseDecoder<
        500,
        typeof type[500]["_A"],
        typeof type[500]["_O"],
        never
      >(500, type[500])) as r.ResponseDecoder<r.IResponseType<500, A2, never>>;

  return r.composeResponseDecoders(r.composeResponseDecoders(d204, d404), d500);
}

// Decodes the success response with the type defined in the specs
export const deleteTaskDefaultDecoder = () => deleteTaskDecoder();
