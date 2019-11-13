type RecordIdArray = ReadonlyArray<number>;

export interface OriginRecordsState {
  [originId: number]: RecordIdArray | undefined;
}
