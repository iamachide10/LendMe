// Item references are embedded in message content as a leading tag:
// [[item:<itemId>|<title>|<priceLabel>]]\n<user text>
const ITEM_TAG_REGEX = /^\[\[item:([^|\]]+)\|([^|\]]+)\|([^\]]+)\]\]\n?/;

export interface ItemTag {
  itemId: string;
  title: string;
  priceLabel: string;
}

export const buildItemTag = (
  itemId: string,
  title: string,
  price: number
): string => {
  const safeTitle = title.replace(/[|[\]]/g, ' ').trim();
  return `[[item:${itemId}|${safeTitle}|GH₵ ${price.toFixed(2)}/day]]\n`;
};

export const parseItemTag = (
  content: string
): { itemTag: ItemTag | null; text: string } => {
  const match = content.match(ITEM_TAG_REGEX);
  if (!match) {
    return { itemTag: null, text: content };
  }
  return {
    itemTag: { itemId: match[1], title: match[2], priceLabel: match[3] },
    text: content.slice(match[0].length),
  };
};
