import { ICPTs } from "../proto/ledger_pb";
import { E8S_PER_TOKEN } from "./constants/constants";
import { FromStringToTokenError } from "./enums/token.enums";

/**
 * Receives a string representing a number and returns the big int or error.
 *
 * @param amount - in string format
 * @returns bigint | FromStringToTokenError
 */
export const convertStringToE8s = (
  amount: string
): bigint | FromStringToTokenError => {
  // Remove all instances of "," and "'".
  amount = amount.trim().replace(/[,']/g, "");

  // Verify that the string is of the format 1234.5678
  const regexMatch = amount.match(/\d*(\.\d*)?/);
  if (!regexMatch || regexMatch[0] !== amount) {
    return FromStringToTokenError.InvalidFormat;
  }

  const [integral, fractional] = amount.split(".");

  let e8s = BigInt(0);

  if (integral) {
    try {
      e8s += BigInt(integral) * E8S_PER_TOKEN;
    } catch {
      return FromStringToTokenError.InvalidFormat;
    }
  }

  if (fractional) {
    if (fractional.length > 8) {
      return FromStringToTokenError.FractionalMoreThan8Decimals;
    }
    try {
      e8s += BigInt(fractional.padEnd(8, "0"));
    } catch {
      return FromStringToTokenError.InvalidFormat;
    }
  }

  return e8s;
};

export interface Token {
  symbol: string;
  name: string;
}

export const ICPToken: Token = {
  symbol: "ICP",
  name: "Internet Computer",
};

/**
 * Represents an amount of tokens.
 *
 * @param e8s - The amount of tokens in bigint.
 * @param token - The token type.
 */
export class TokenAmount {
  private constructor(protected e8s: bigint, public token: Token) {}

  /**
   * Initialize from a bigint. Bigint are considered e8s.
   *
   * @param {amount: bigint; token?: Token;} params
   * @param {bigint} params.amount The amount in bigint format.
   * @param {Token} params.token The token type.
   */
  public static fromE8s({
    amount,
    token,
  }: {
    amount: bigint;
    token: Token;
  }): TokenAmount {
    return new TokenAmount(amount, token);
  }

  /**
   * Initialize from a string. Accepted formats:
   *
   * 1234567.8901
   * 1'234'567.8901
   * 1,234,567.8901
   *
   * @param {amount: string; token?: Token;} params
   * @param {string} params.amount The amount in string format.
   * @param {Token} params.token The token type.
   */
  public static fromString({
    amount,
    token,
  }: {
    amount: string;
    token: Token;
  }): TokenAmount | FromStringToTokenError {
    const e8s = convertStringToE8s(amount);

    if (typeof e8s === "bigint") {
      return new TokenAmount(e8s, token);
    }
    return e8s;
  }

  /**
   * Initialize from a number.
   *
   * 1 integer is considered E8S_PER_TOKEN
   *
   * @param {amount: number; token?: Token;} params
   * @param {string} params.amount The amount in number format.
   * @param {Token} params.token The token type.
   */
  public static fromNumber({
    amount,
    token,
  }: {
    amount: number;
    token: Token;
  }): TokenAmount {
    const e8s = BigInt(Math.floor(amount * Number(E8S_PER_TOKEN)));
    return TokenAmount.fromE8s({
      amount: e8s,
      token,
    });
  }

  /**
   *
   * @returns The amount of e8s.
   */
  public toE8s(): bigint {
    return this.e8s;
  }

  /**
   * TODO: Remove this method when ICP class is not used anymore
   * @deprecated
   */
  public toProto(): ICPTs {
    const proto = new ICPTs();
    proto.setE8s(this.e8s.toString());
    return proto;
  }
}
