import { Container, ErrorResponse } from "@azure/cosmos";
import * as E from "fp-ts/lib/Either.js";
import { describe, expect, it } from "vitest";

import { aTask } from "../../../../domain/__tests__/data.js";
import { ItemAlreadyExists } from "../../../../domain/errors.js";
import { makeTaskRepository } from "../TaskRepository.js";
import { makeContainerMock } from "./mocks.js";

describe("TaskRepository", () => {
  describe("insert", () => {
    it("should return ItemAlreadyExists error", async () => {
      const container = makeContainerMock();

      const error = new ErrorResponse("");
      error.code = 409;

      container.items.create.mockRejectedValueOnce(error);

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.insert(aTask)();
      expect(actual).toMatchObject(
        E.left(
          new ItemAlreadyExists(
            `The item already exists; original error body: ${error.body}`,
          ),
        ),
      );
      expect(container.items.create).nthCalledWith(1, aTask);
    });
    it("should return the persisted task", async () => {
      const container = makeContainerMock();

      container.items.create.mockResolvedValue(aTask);

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.insert(aTask)();
      expect(actual).toStrictEqual(E.right(aTask));
      expect(container.items.create).nthCalledWith(1, aTask);
    });
  });
});
