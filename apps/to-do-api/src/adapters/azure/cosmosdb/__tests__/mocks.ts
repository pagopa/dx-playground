import { mock, mockFn } from "vitest-mock-extended";

export const makeContainerMock = () =>
  mock({
    items: {
      create: mockFn(),
    },
  });
