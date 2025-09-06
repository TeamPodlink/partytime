/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as helpers from "../../__test__/helpers";

const phase = 8;

describe("phase 8", () => {
  let feed;
  beforeAll(async () => {
    feed = await helpers.loadSimple();
  });

  describe("podcast:follow", () => {
    const supportedName = "follow";

    it("correctly identifies a basic feed", () => {
      const result = helpers.parseValidFeed(feed);

      expect(result).not.toHaveProperty("podcastFollow");
      expect(helpers.getPhaseSupport(result, phase)).not.toContain(supportedName);
    });

    it("ignores missing url", () => {
      const xml = helpers.spliceFeed(
        feed,
        // missing url, not valid
        `<podcast:follow/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).not.toHaveProperty("podcastFollow");
      expect(helpers.getPhaseSupport(result, phase)).not.toContain(supportedName);
    });

    it("extracts a single follow url", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:follow url="https://examplehost.com/feed/12345678/followlinks.json"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastFollow");
      expect(result.podcastFollow).toHaveProperty("url", "https://examplehost.com/feed/12345678/followlinks.json");
      expect(helpers.getPhaseSupport(result, phase)).toContain(supportedName);
    });

    it("extracts follow url with different domain", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:follow url="https://radiotopia.fm/followlinks.json"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastFollow");
      expect(result.podcastFollow).toHaveProperty("url", "https://radiotopia.fm/followlinks.json");
      expect(helpers.getPhaseSupport(result, phase)).toContain(supportedName);
    });

    it("handles multiple follow tags by taking the first one", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:follow url="https://examplehost.com/feed/12345678/followlinks.json"/>
         <podcast:follow url="https://anotherhost.com/feed/87654321/followlinks.json"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastFollow");
      expect(result.podcastFollow).toHaveProperty("url", "https://examplehost.com/feed/12345678/followlinks.json");
      expect(helpers.getPhaseSupport(result, phase)).toContain(supportedName);
    });

    it("handles empty url attribute", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:follow url=""/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).not.toHaveProperty("podcastFollow");
      expect(helpers.getPhaseSupport(result, phase)).not.toContain(supportedName);
    });

    it("handles whitespace-only url attribute", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:follow url="   "/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).not.toHaveProperty("podcastFollow");
      expect(helpers.getPhaseSupport(result, phase)).not.toContain(supportedName);
    });
  });
});
