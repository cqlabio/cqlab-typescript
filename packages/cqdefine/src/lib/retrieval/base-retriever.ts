export interface BaseRetriever {
  getPatient(): Promise<any>;
}
