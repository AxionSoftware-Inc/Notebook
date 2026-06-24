import { describe, expect, it } from "vitest";

import { getMediaUrl } from "./api";

describe("getMediaUrl", () => {
    it("leaves absolute urls unchanged", () => {
        expect(getMediaUrl("https://cdn.example.com/media/file.png")).toBe("https://cdn.example.com/media/file.png");
    });

    it("joins backend origin for relative media paths", () => {
        expect(getMediaUrl("/media/plots/example.png")).toBe("http://127.0.0.1:8000/media/plots/example.png");
    });
});
