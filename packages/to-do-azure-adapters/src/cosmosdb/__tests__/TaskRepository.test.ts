import { Container, ErrorResponse } from "@azure/cosmos";
import { ItemAlreadyExists, TaskCodec } from "@to-do/domain";
import { aTask } from "@to-do/domain/test/data";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import { describe, expect, it } from "vitest";

import { makeTaskRepository } from "../TaskRepository.js";
import { makeContainerMock } from "./mocks.js";

describe("TaskRepository", () => {
  describe("delete", () => {
    const { id } = aTask;
    it("should return a Left with the error", async () => {
      const container = makeContainerMock();

      const error = new Error("Something went wrong");
      container.item.mockReturnValueOnce({
        delete: () => Promise.reject(error),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.delete(id)();
      expect(actual).toStrictEqual(E.left(error));
    });
    it("should return a Right", async () => {
      const container = makeContainerMock();

      container.item.mockReturnValueOnce({
        delete: () => Promise.resolve(aTask),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.delete(id)();
      expect(actual).toStrictEqual(E.right(undefined));
    });
  });

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

  describe("list", () => {
    it("should return a Left with the error", async () => {
      const container = makeContainerMock();

      const error = new Error("Something went wrong");
      container.items.query.mockReturnValueOnce({
        fetchAll: () => Promise.reject(error),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.list()();
      expect(actual).toStrictEqual(E.left(error));
    });
    it("should return a Left with the decoding error", async () => {
      const container = makeContainerMock();

      const anInvalidObject = { key: "aKey" };
      container.items.query.mockReturnValueOnce({
        fetchAll: () => Promise.resolve({ resources: [anInvalidObject] }),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.list()();
      expect(actual).toStrictEqual(
        E.left(
          new Error(
            `Unable to parse the resources using codec ${TaskCodec.name}`,
          ),
        ),
      );
    });
    it("should return a Right with list of tasks", async () => {
      const container = makeContainerMock();

      container.items.query.mockReturnValueOnce({
        fetchAll: () => Promise.resolve({ resources: [{ ...aTask }] }),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.list()();
      expect(actual).toStrictEqual(E.right([aTask]));
      expect(container.items.query).nthCalledWith(1, "SELECT * FROM c");
    });
  });

  describe("get", () => {
    const { id } = aTask;
    it("should return None when the item does not exist", async () => {
      const container = makeContainerMock();

      container.item.mockReturnValueOnce({
        read: () => Promise.resolve({ resource: undefined }),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.get(id)();
      expect(actual).toStrictEqual(E.right(O.none));
      expect(container.item).toBeCalledWith(id, id);
    });
    it("should return Some with the desired task", async () => {
      const container = makeContainerMock();

      container.item.mockReturnValueOnce({
        read: () => Promise.resolve({ resource: aTask }),
      });

      const repository = makeTaskRepository(container as unknown as Container);

      const actual = await repository.get(id)();
      expect(actual).toStrictEqual(E.right(O.some(aTask)));
      // Make sure to use a point read (id, partitionKey) to get the item
      expect(container.item).toBeCalledWith(id, id);
    });
  });
});
