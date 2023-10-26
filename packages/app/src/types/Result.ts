export type Result<T, E extends Error = Error> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  public constructor(public readonly value: T) {}

  public isOk(): this is Ok<T, E> {
    return true;
  }
}

export class Err<T, E extends Error> {
  public constructor(public readonly error: E) {}

  public isOk(): this is Ok<T, E> {
    return false;
  }
}

export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);

export const err = <T, E extends Error | string>(error: E): Err<T, Error> =>
  typeof error === "string" ? new Err(new Error(error)) : new Err(error);
