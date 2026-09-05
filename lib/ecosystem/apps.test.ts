import { describe, expect, it } from "vitest";

import { getEcosystemHref, getEcosystemRouteHref } from "./apps";

describe("ecosystem routing", () => {
  it("preserves Project context on primary app navigation", () => {
    expect(getEcosystemHref("math", "notebook", "project 1")).toBe("/math/laboratory?project=project+1");
  });

  it("routes linked evidence directly to Writer new", () => {
    expect(getEcosystemRouteHref("writer", "/new", "notebook", "p1", { source: "project", objectId: "o1" }))
      .toBe("/writer/new?project=p1&source=project&objectId=o1");
  });

  it("routes back to Science projects without prefix drift", () => {
    expect(getEcosystemRouteHref("science", "/projects", "notebook", "p1"))
      .toBe("/projects?project=p1");
  });
});
