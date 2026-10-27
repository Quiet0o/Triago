<?php

declare(strict_types=1);

namespace App\Tests\Util;

use App\Util\LexoRank;
use PHPUnit\Framework\TestCase;

final class LexoRankTest extends TestCase
{
    public function testInitialRank(): void
    {
        $initial = LexoRank::initial();
        $this->assertSame('0|hzzzzz:', $initial);
    }

    public function testBetweenTwoRanks(): void
    {
        $r1 = '0|100000:';
        $r2 = '0|300000:';
        $mid = LexoRank::between($r1, $r2);

        $this->assertGreaterThan(0, strcmp($mid, $r1));
        $this->assertLessThan(0, strcmp($mid, $r2));
    }

    public function testBetweenAdjacentCharacters(): void
    {
        $r1 = '0|a:';
        $r2 = '0|b:';
        $mid = LexoRank::between($r1, $r2);

        $this->assertGreaterThan(0, strcmp($mid, $r1));
        $this->assertLessThan(0, strcmp($mid, $r2));
    }

    public function testInsertBeforeStart(): void
    {
        $first = '0|hzzzzz:';
        $before = LexoRank::between(null, $first);

        $this->assertLessThan(0, strcmp($before, $first));
    }

    public function testInsertAfterEnd(): void
    {
        $last = '0|hzzzzz:';
        $after = LexoRank::between($last, null);

        $this->assertGreaterThan(0, strcmp($after, $last));
    }

    public function testConsecutiveInsertionsKeepOrdering(): void
    {
        $current = LexoRank::initial();
        for ($i = 0; $i < 10; ++$i) {
            $next = LexoRank::between($current, null);
            $this->assertGreaterThan(0, strcmp($next, $current));
            $current = $next;
        }
    }
}
