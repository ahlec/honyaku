export enum Environment {
  Development,
  Production
}

export const CURRENT_ENVIRONMENT =
  process.env.NODE_ENV === "production"
    ? Environment.Production
    : Environment.Development;
