//https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
import { CLASS_PREFIX } from '@filbert-js/types';
export function hash(str, prefix = CLASS_PREFIX) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return `${prefix}-${hash}`;
}
