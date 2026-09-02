import { describe, expect, it } from "vitest";

import { canonicalPair, pairKeyOf } from "@/lib/social/pair";

describe("canonicalPair / pairKeyOf", () => {
  it("es simétrico: A,B y B,A producen el mismo resultado", () => {
    expect(canonicalPair("user_a", "user_b")).toEqual(canonicalPair("user_b", "user_a"));
    expect(pairKeyOf("user_a", "user_b")).toBe(pairKeyOf("user_b", "user_a"));
  });

  it("ordena lexicográficamente", () => {
    expect(canonicalPair("z", "a")).toEqual({ lowId: "a", highId: "z" });
  });
});
