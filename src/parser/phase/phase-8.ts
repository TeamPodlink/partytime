import {
  ensureArray,
  extractOptionalIntegerAttribute,
  extractOptionalStringAttribute,
  getAttribute,
  getKnownAttribute,
} from "../shared";
import type { XmlNode } from "../types";

export type Phase8PodcastImage = {
  href: string;
  alt?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  type?: string;
  purpose?: string;
};

export const podcastImage = {
  phase: 8,
  name: "image",
  tag: "podcast:image",
  nodeTransform: (node: XmlNode | XmlNode[]): XmlNode =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    ensureArray(node).find((n) => getAttribute(n, "href")),
  supportCheck: (node: XmlNode): boolean => Boolean(getAttribute(node, "href")),
  fn(node: XmlNode): { podcastImage: Phase8PodcastImage } {
    return {
      podcastImage: {
        href: getKnownAttribute(node, "href"),
        ...extractOptionalStringAttribute(node, "alt"),
        ...extractOptionalStringAttribute(node, "aspect-ratio", "aspectRatio"),
        ...extractOptionalIntegerAttribute(node, "width"),
        ...extractOptionalIntegerAttribute(node, "height"),
        ...extractOptionalStringAttribute(node, "type"),
        ...extractOptionalStringAttribute(node, "purpose"),
      },
    };
  },
};
