import { mock, mockFn } from "vitest-mock-extended";

export const makeContainerMock = () =>
  mock({
    item: mockFn(),
    items: {
      create: mockFn(),
      query: mockFn(),
    },
  });
