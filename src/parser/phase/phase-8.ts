import { firstIfArray, getAttribute, getKnownAttribute } from "../shared";
import type { XmlNode } from "../types";

export type Phase8Follow = {
  url: string;
};

export const podcastFollow = {
  phase: 8,
  name: "follow",
  tag: "podcast:follow",
  nodeTransform: firstIfArray,
  supportCheck: (node: XmlNode): boolean =>
    Boolean(getAttribute(node, "url")),
  fn(node: XmlNode): { podcastFollow: Phase8Follow } {
    return {
      podcastFollow: {
        url: getKnownAttribute(node, "url"),
      },
    };
  },
};
