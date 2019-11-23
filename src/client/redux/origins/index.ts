import { Origin, OriginType } from "@common/types";

export interface OriginsState {
  [originId: number]: Origin;
}

export type OriginsLookup = { [type in OriginType]: ReadonlyArray<Origin> };

export interface OriginTypeLookup {
  [originId: number]: OriginType;
  [originId: string]: OriginType;
}
