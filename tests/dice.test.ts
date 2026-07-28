import { describe, expect, it, vi } from "vitest";
import { DiceFormulaError, formatDiceResult, parseDiceFormula, rollDice } from "@/lib/dice";

describe("parseDiceFormula", () => {
  it("parses 1d20+3", () => {
    const parsed = parseDiceFormula("1d20+3");
    expect(parsed).toEqual({ formula: "1d20+3", quantity: 1, sides: 20, keep: undefined, modifier: 3 });
  });

  it("parses 2d6", () => {
    const parsed = parseDiceFormula("2d6");
    expect(parsed.quantity).toBe(2);
    expect(parsed.sides).toBe(6);
    expect(parsed.modifier).toBe(0);
  });

  it("parses 4d10+2", () => {
    const parsed = parseDiceFormula("4d10+2");
    expect(parsed).toMatchObject({ quantity: 4, sides: 10, modifier: 2 });
  });

  it("parses keep highest 2d20kh1", () => {
    const parsed = parseDiceFormula("2d20kh1");
    expect(parsed.keep).toEqual({ mode: "kh", count: 1 });
  });

  it("parses keep lowest 2d20kl1", () => {
    const parsed = parseDiceFormula("2d20kl1");
    expect(parsed.keep).toEqual({ mode: "kl", count: 1 });
  });

  it("rejects invalid formula", () => {
    expect(() => parseDiceFormula("banana")).toThrow(DiceFormulaError);
  });

  it("rejects too many dice", () => {
    expect(() => parseDiceFormula("101d6")).toThrow(DiceFormulaError);
  });

  it("rejects dice larger than d1000", () => {
    expect(() => parseDiceFormula("1d1001")).toThrow(DiceFormulaError);
  });

  it("rejects empty formula", () => {
    expect(() => parseDiceFormula("   ")).toThrow(DiceFormulaError);
  });
});

describe("rollDice", () => {
  it("rolls within bounds for 2d6", () => {
    const result = rollDice("2d6");
    expect(result.rolls).toHaveLength(2);
    result.rolls.forEach((r) => {
      expect(r).toBeGreaterThanOrEqual(1);
      expect(r).toBeLessThanOrEqual(6);
    });
    expect(result.total).toBe(result.rolls[0] + result.rolls[1]);
  });

  it("keeps highest die for kh1", () => {
    const rnd = vi.spyOn(Math, "random");
    rnd.mockReturnValueOnce(0.1).mockReturnValueOnce(0.95);
    const result = rollDice("2d20kh1");
    expect(result.rolls).toEqual([3, 20]);
    expect(result.kept).toEqual([20]);
    expect(result.dropped).toEqual([3]);
    expect(result.total).toBe(20);
    rnd.mockRestore();
  });

  it("keeps lowest die for kl1", () => {
    const rnd = vi.spyOn(Math, "random");
    rnd.mockReturnValueOnce(0.1).mockReturnValueOnce(0.95);
    const result = rollDice("2d20kl1");
    expect(result.kept).toEqual([3]);
    expect(result.total).toBe(3);
    rnd.mockRestore();
  });

  it("flags a natural 20 on a single d20 as critical success", () => {
    const rnd = vi.spyOn(Math, "random").mockReturnValue(0.9999);
    const result = rollDice("1d20");
    expect(result.isCriticalSuccess).toBe(true);
    rnd.mockRestore();
  });

  it("flags a natural 1 on a single d20 as critical failure", () => {
    const rnd = vi.spyOn(Math, "random").mockReturnValue(0);
    const result = rollDice("1d20");
    expect(result.isCriticalFailure).toBe(true);
    rnd.mockRestore();
  });
});

describe("formatDiceResult", () => {
  it("formats a simple result", () => {
    const result = rollDice({ formula: "1d20+3", quantity: 1, sides: 20, modifier: 3 });
    expect(formatDiceResult(result)).toContain("=");
  });
});
