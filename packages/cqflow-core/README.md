# cqflow-core

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build cqflow-core` to build the library.

## Running unit tests

Run `nx test cqflow-core` to execute the unit tests via [Jest](https://jestjs.io).

TODO:

- Add jsonSchema/ or Validator for flow inputData
- FlowDefinition validation
  - bindIds needs to be unqiue and have certain regex
  - all nextIds must resolve
  - must have exacly one start, and must always end at an end node.
