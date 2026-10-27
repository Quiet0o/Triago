const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const BASE = 36;
const DEFAULT_BUCKET = '0';
const INITIAL = '0|hzzzzz:';

export class LexoRank {
  static readonly INITIAL = INITIAL;

  static initial(): string {
    return INITIAL;
  }

  /**
   * Calculate a rank between prev and next ranks.
   */
  static between(prev?: string | null, next?: string | null): string {
    const prevVal = this.extractValue(prev);
    const nextVal = this.extractValue(next);

    if (!prevVal && !nextVal) {
      return INITIAL;
    }

    if (!prevVal && nextVal) {
      const mid = this.midpoint('0', nextVal);
      return this.format(mid);
    }

    if (prevVal && !nextVal) {
      const mid = this.midpoint(prevVal, 'zzzzzz');
      return this.format(mid);
    }

    if (prevVal === nextVal) {
      return this.format((prevVal ?? '') + 'i');
    }

    let p = prevVal!;
    let n = nextVal!;
    if (p.localeCompare(n) > 0) {
      [p, n] = [n, p];
    }

    const mid = this.midpoint(p, n);
    return this.format(mid);
  }

  /**
   * Generate evenly distributed ranks for a given count of items.
   */
  static generateRanks(count: number): string[] {
    if (count <= 0) return [];
    const step = Math.max(1, Math.floor(BASE / (count + 1)));
    const ranks: string[] = [];
    for (let i = 1; i <= count; i++) {
      const char = ALPHABET[Math.min(BASE - 1, i * step)];
      ranks.push(this.format(char + '00000'));
    }
    return ranks;
  }

  private static midpoint(prev: string, next: string): string {
    const maxLen = Math.max(prev.length, next.length);
    const prevPadded = prev.padEnd(maxLen, '0');
    const nextPadded = next.padEnd(maxLen, '0');

    let result = '';

    for (let i = 0; i < maxLen; i++) {
      const cPrev = prevPadded[i];
      const cNext = nextPadded[i];

      if (cPrev === cNext) {
        result += cPrev;
        continue;
      }

      const vPrev = ALPHABET.indexOf(cPrev);
      const vNext = ALPHABET.indexOf(cNext);

      if (vPrev === -1 || vNext === -1) break;

      const diff = vNext - vPrev;

      if (diff > 1) {
        const midIndex = Math.floor((vPrev + vNext) / 2);
        result += ALPHABET[midIndex];
        return result;
      }

      // diff === 1 (e.g. 'a' and 'b')
      result += ALPHABET[vPrev];

      const nextPrevChar = i + 1 < prev.length ? prev[i + 1] : '0';
      const nextPrevVal = Math.max(0, ALPHABET.indexOf(nextPrevChar));
      const midNextVal = Math.floor((nextPrevVal + BASE) / 2);
      result += ALPHABET[midNextVal];
      return result;
    }

    return result + 'i';
  }

  private static extractValue(rank?: string | null): string | null {
    if (!rank || !rank.trim()) return null;
    const trimmed = rank.trim();
    const match = trimmed.match(/^[0-2]\|([0-9a-z]+):?$/);
    if (match) return match[1];
    return trimmed.toLowerCase().replace(/[^0-9a-z]/g, '') || null;
  }

  private static format(value: string): string {
    return `${DEFAULT_BUCKET}|${value}:`;
  }
}
