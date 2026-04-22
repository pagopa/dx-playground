import { Task, TaskCacheRepository, TaskCodec } from "@to-do/domain";
import * as E from "fp-ts/lib/Either.js";
import { pipe } from "fp-ts/lib/function.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";

export interface RedisTaskCacheClient {
  del: (key: string) => Promise<number>;
  get: (key: string) => Promise<null | string>;
  setEx: (key: string, seconds: number, value: string) => Promise<string>;
}

const makeTaskCacheKey = (id: Task["id"]) => `task:${id}`;

export const makeTaskCache = (
  client: RedisTaskCacheClient,
  ttlSeconds: number,
): TaskCacheRepository => ({
  delete: (id) =>
    pipe(
      TE.tryCatch(() => client.del(makeTaskCacheKey(id)), E.toError),
      TE.map(() => void 0),
    ),
  get: (id) =>
    pipe(
      TE.tryCatch(() => client.get(makeTaskCacheKey(id)), E.toError),
      TE.flatMap((value) => {
        if (value === null) {
          return TE.right(O.none);
        }

        return pipe(
          TE.tryCatch(() => Promise.resolve(JSON.parse(value)), E.toError),
          TE.flatMapEither((payload) =>
            pipe(
              TaskCodec.decode(payload),
              E.bimap(
                () =>
                  new Error(
                    `Unable to parse the ${id} using codec ${TaskCodec.name}`,
                  ),
                O.some,
              ),
            ),
          ),
        );
      }),
    ),
  set: (task) =>
    pipe(
      TE.tryCatch(
        () =>
          client.setEx(
            makeTaskCacheKey(task.id),
            ttlSeconds,
            JSON.stringify(task),
          ),
        E.toError,
      ),
      TE.map(() => void 0),
    ),
});
