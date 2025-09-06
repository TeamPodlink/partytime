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

  describe("podcast:image", () => {
    const supportedName = "image";

    it("correctly identifies a basic feed", () => {
      const result = helpers.parseValidFeed(feed);

      expect(result).not.toHaveProperty("podcastImage");
      expect(helpers.getPhaseSupport(result, phase)).not.toContain(supportedName);
    });

    it("ignores missing href", () => {
      const xml = helpers.spliceFeed(
        feed,
        // missing href, not valid
        `<podcast:image type="image/jpeg" width="1400" height="1400"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).not.toHaveProperty("podcastImage");
      expect(helpers.getPhaseSupport(result, phase)).not.toContain(supportedName);
    });

    it("extracts a basic image with only href", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.jpg"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("href", "https://example.com/image.jpg");
      expect(result.podcastImage).not.toHaveProperty("type");
      expect(result.podcastImage).not.toHaveProperty("width");
      expect(result.podcastImage).not.toHaveProperty("height");
      expect(helpers.getPhaseSupport(result, phase)).toContain(supportedName);
    });

    it("extracts an image with all attributes", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.jpg" alt="Test image" aspect-ratio="1/1" type="image/jpeg" width="1400" height="1400" purpose="artwork"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("href", "https://example.com/image.jpg");
      expect(result.podcastImage).toHaveProperty("alt", "Test image");
      expect(result.podcastImage).toHaveProperty("aspectRatio", "1/1");
      expect(result.podcastImage).toHaveProperty("type", "image/jpeg");
      expect(result.podcastImage).toHaveProperty("width", 1400);
      expect(result.podcastImage).toHaveProperty("height", 1400);
      expect(result.podcastImage).toHaveProperty("purpose", "artwork");
      expect(helpers.getPhaseSupport(result, phase)).toContain(supportedName);
    });

    it("extracts an image with partial attributes", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.png" type="image/png" width="800"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("href", "https://example.com/image.png");
      expect(result.podcastImage).toHaveProperty("type", "image/png");
      expect(result.podcastImage).toHaveProperty("width", 800);
      expect(result.podcastImage).not.toHaveProperty("height");
      expect(helpers.getPhaseSupport(result, phase)).toContain(supportedName);
    });

    it("handles numeric width and height as integers", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.jpg" width="1920" height="1080"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("width", 1920);
      expect(result.podcastImage).toHaveProperty("height", 1080);
      expect(typeof result.podcastImage?.width).toBe("number");
      expect(typeof result.podcastImage?.height).toBe("number");
    });

    it("extracts aspect-ratio attribute", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.jpg" aspect-ratio="16/9"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("aspectRatio", "16/9");
    });

    it("extracts purpose attribute", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.jpg" purpose="artwork social"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("purpose", "artwork social");
    });

    it("extracts alt attribute for accessibility", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/image.jpg" alt="An antenna emanating signal waves"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("alt", "An antenna emanating signal waves");
    });

    it("handles video type with aspect-ratio", () => {
      const xml = helpers.spliceFeed(
        feed,
        `<podcast:image href="https://example.com/video.mp4" type="video/mp4" aspect-ratio="9/16" width="1200"/>`
      );
      const result = helpers.parseValidFeed(xml);

      expect(result).toHaveProperty("podcastImage");
      expect(result.podcastImage).toHaveProperty("href", "https://example.com/video.mp4");
      expect(result.podcastImage).toHaveProperty("type", "video/mp4");
      expect(result.podcastImage).toHaveProperty("aspectRatio", "9/16");
      expect(result.podcastImage).toHaveProperty("width", 1200);
    });
  });
});
