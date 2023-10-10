export abstract class LazyMockDataContainer<T> {
  abstract loadMockData(id: string): Promise<T>;
}
