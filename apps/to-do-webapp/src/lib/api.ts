"use server";

import { client } from "@/lib/client";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

export const getTaskList = async () =>
  pipe(
    TE.tryCatch(
      () => client.listTasks({}),
      () => new Error("Server error"),
    ),
    TE.map(E.mapLeft((errors) => new Error(errors.join("\n")))),
    TE.chain(TE.fromEither),
    TE.fold(
      (error) => () => Promise.reject(error),
      (result) => () => Promise.resolve(result),
    ),
  )();

export const insertTask = async (title: string) =>
  pipe(
    TE.tryCatch(
      () => client.createTask({ body: { title } }),
      () => new Error("Server error"),
    ),
    TE.map(E.mapLeft((errors) => new Error(errors.join("\n")))),
    TE.chain(TE.fromEither),
    TE.fold(
      (error) => () => Promise.reject(error),
      (result) => () => Promise.resolve(result),
    ),
  )();

export const completeTask = async (taskId: string) =>
  pipe(
    TE.tryCatch(
      () => client.deleteTask({ taskId }),
      () => new Error("Server error"),
    ),
    TE.map(E.mapLeft((errors) => new Error(errors.join("\n")))),
    TE.chain(TE.fromEither),
    TE.fold(
      (error) => () => Promise.reject(error),
      (result) => () => Promise.resolve(result),
    ),
  )();
