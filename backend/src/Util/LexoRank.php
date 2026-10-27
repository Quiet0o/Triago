<?php

declare(strict_types=1);

namespace App\Util;

final class LexoRank
{
    private const string ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
    private const int BASE = 36;
    private const string DEFAULT_BUCKET = '0';
    public const string INITIAL = '0|hzzzzz:';

    public static function initial(): string
    {
        return self::INITIAL;
    }

    /**
     * Calculate a rank between $prev and $next.
     *
     * @param string|null $prev Previous rank string (or null if inserting at start)
     * @param string|null $next Next rank string (or null if inserting at end)
     */
    public static function between(?string $prev, ?string $next): string
    {
        $prevVal = self::extractValue($prev);
        $nextVal = self::extractValue($next);

        if (null === $prevVal && null === $nextVal) {
            return self::INITIAL;
        }

        if (null === $prevVal) {
            /** @var string $nextVal */
            $mid = self::midpoint('0', $nextVal);

            return self::format($mid);
        }

        if (null === $nextVal) {
            $mid = self::midpoint($prevVal, 'zzzzzz');

            return self::format($mid);
        }

        /** @var string $prevVal */
        /** @var string $nextVal */
        if ($prevVal === $nextVal) {
            return self::format($prevVal.'i');
        }

        if (strcmp($prevVal, $nextVal) > 0) {
            [$prevVal, $nextVal] = [$nextVal, $prevVal];
        }

        $mid = self::midpoint($prevVal, $nextVal);

        return self::format($mid);
    }

    /**
     * Generate $count evenly distributed ranks.
     *
     * @return list<string>
     */
    public static function generateRanks(int $count): array
    {
        if ($count <= 0) {
            return [];
        }

        $ranks = [];
        $step = (int) floor(self::BASE / ($count + 1));
        if ($step < 1) {
            $step = 1;
        }

        for ($i = 1; $i <= $count; ++$i) {
            $val = self::ALPHABET[min(self::BASE - 1, $i * $step)].'00000';
            $ranks[] = self::format($val);
        }

        return $ranks;
    }

    private static function midpoint(string $prev, string $next): string
    {
        $maxLen = max(strlen($prev), strlen($next));
        $prevPadded = str_pad($prev, $maxLen, '0');
        $nextPadded = str_pad($next, $maxLen, '0');

        $result = '';

        for ($i = 0; $i < $maxLen; ++$i) {
            $cPrev = $prevPadded[$i];
            $cNext = $nextPadded[$i];

            if ($cPrev === $cNext) {
                $result .= $cPrev;
                continue;
            }

            $vPrev = strpos(self::ALPHABET, $cPrev);
            $vNext = strpos(self::ALPHABET, $cNext);

            if (false === $vPrev || false === $vNext) {
                break;
            }

            $diff = $vNext - $vPrev;

            if ($diff > 1) {
                $midIndex = (int) floor(($vPrev + $vNext) / 2);
                $result .= self::ALPHABET[$midIndex];

                return $result;
            }

            // diff === 1 (e.g. 'a' and 'b')
            $result .= self::ALPHABET[$vPrev];

            // Look at next digit of prev
            $nextPrevChar = ($i + 1 < strlen($prev)) ? $prev[$i + 1] : '0';
            $nextPrevVal = strpos(self::ALPHABET, $nextPrevChar);
            if (false === $nextPrevVal) {
                $nextPrevVal = 0;
            }

            $midNextVal = (int) floor(($nextPrevVal + self::BASE) / 2);
            $result .= self::ALPHABET[$midNextVal];

            return $result;
        }

        // Exact match of prefix
        return $result.'i';
    }

    private static function extractValue(?string $rank): ?string
    {
        if (null === $rank || '' === trim($rank)) {
            return null;
        }

        $trimmed = trim($rank);
        if (preg_match('/^[0-2]\|([0-9a-z]+):?$/', $trimmed, $matches)) {
            return $matches[1];
        }

        return preg_replace('/[^0-9a-z]/', '', strtolower($trimmed)) ?: null;
    }

    private static function format(string $value): string
    {
        return self::DEFAULT_BUCKET.'|'.$value.':';
    }
}
