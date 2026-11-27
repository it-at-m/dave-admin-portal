import { describe, expect, it } from "vitest";

import StadtbezirksviertelUtils from "@/util/StadtbezirksviertelUtils";

describe("StadtbezirksviertelUtils", () => {
  it("wandelt eine Viertelnummer in die fortlaufende Nummer um", () => {
    expect(StadtbezirksviertelUtils.convertToSequentialNumber("01.2.3")).toBe(
      23
    );
  });

  it("liefert NaN für ein ungültiges Format", () => {
    expect(
      StadtbezirksviertelUtils.convertToSequentialNumber("1.2.3")
    ).toBeNaN();
  });
});
