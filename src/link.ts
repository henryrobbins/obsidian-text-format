import { stringFormat } from "./format";
import { WikiLinkFormatGroup } from "./setting";

export function removeWikiLink(s: string, formatGroup: WikiLinkFormatGroup): string {
  return s.replace(/\[\[.*?\]\]/g, function (t) {
    let wiki_exec = /\[\[(?<title>[^\[#|]+)(?<heading>#[^|\]]+)?(?<alias>\|[^|\]]+)?\]\]/g.exec(t);
    let G = wiki_exec.groups;
    let groupArgs = {
      title: G.title,
      heading: G.heading?.slice(1),
      alias: G.alias?.slice(1)
    };
    if (G.heading === undefined && G.alias === undefined) {
      return G.title;
    } else if (G.alias !== undefined && G.heading === undefined) {
      return stringFormat(formatGroup.aliasOnly, groupArgs);
    } else if (G.alias === undefined && G.heading !== undefined) {
      return stringFormat(formatGroup.headingOnly, groupArgs);
    } else {
      return stringFormat(formatGroup.both, groupArgs);
    }
  });
}

export function removeUrlLink(s: string, UrlLinkFormat: string): string {
  const rx = /\[([^\]]*?)\]\(\S+?\)/g;
  return s.replace(rx, function (t) {
    const regex = /\[(?<text>.*?)\]\((?<url>https?:\/\/\S+)\)/;
    const match = t.match(regex);
    if (match && match.length === 3) {
      return stringFormat(UrlLinkFormat, match.groups);
    } else {
      return s;
    }
  });
}

export function url2WikiLink(s: string): string {
  let rx = /\[.*?\]\(.+?\)/g;
  return s.replace(rx, function (t) {
    return `[[${t.match(/\[(.*?)\]/)[1]}]]`;
  });
}
