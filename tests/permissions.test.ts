import { describe, expect, it } from "vitest";
import {
  canEditCampaign,
  canManageScene,
  canMoveToken,
  canRollDice,
  canUseAI,
  canViewNote,
  canWriteChat,
} from "@/lib/permissions";

describe("canMoveToken", () => {
  it("lets the master move any token", () => {
    expect(canMoveToken("master", { ownerId: "player-1", locked: false }, "master-1")).toBe(true);
  });

  it("lets a player move only their own token", () => {
    expect(canMoveToken("player", { ownerId: "player-1", locked: false }, "player-1")).toBe(true);
    expect(canMoveToken("player", { ownerId: "player-2", locked: false }, "player-1")).toBe(false);
  });

  it("never lets a spectator move a token", () => {
    expect(canMoveToken("spectator", { ownerId: "player-1", locked: false }, "player-1")).toBe(false);
  });

  it("blocks non-masters from moving a locked token", () => {
    expect(canMoveToken("player", { ownerId: "player-1", locked: true }, "player-1")).toBe(false);
    expect(canMoveToken("master", { ownerId: "player-1", locked: true }, "master-1")).toBe(true);
  });

  it("returns false with no role", () => {
    expect(canMoveToken(null, { ownerId: "player-1", locked: false }, "player-1")).toBe(false);
  });
});

describe("canViewNote", () => {
  it("shows shared notes to everyone with a role", () => {
    expect(canViewNote("player", "shared")).toBe(true);
    expect(canViewNote("spectator", "shared")).toBe(true);
  });

  it("hides master notes from players and spectators", () => {
    expect(canViewNote("player", "master")).toBe(false);
    expect(canViewNote("spectator", "master")).toBe(false);
  });

  it("shows master notes only to the master", () => {
    expect(canViewNote("master", "master")).toBe(true);
  });
});

describe("other role gates", () => {
  it("only the master can edit the campaign or manage scenes", () => {
    expect(canEditCampaign("master")).toBe(true);
    expect(canEditCampaign("player")).toBe(false);
    expect(canManageScene("player")).toBe(false);
  });

  it("master and player can roll dice, use AI and write chat; spectator cannot", () => {
    for (const fn of [canRollDice, canUseAI, canWriteChat]) {
      expect(fn("master")).toBe(true);
      expect(fn("player")).toBe(true);
      expect(fn("spectator")).toBe(false);
      expect(fn(null)).toBe(false);
    }
  });
});
