import { assertEquals, assertThrows } from "@std/assert";
import { convertToCron } from "./cron.ts";

Deno.test("1分から59分の間は分単位のcron文字列を正しく生成する", () => {
  assertEquals(convertToCron(1), "*/1 * * * *");
  assertEquals(convertToCron(30), "*/30 * * * *");
  assertEquals(convertToCron(59), "*/59 * * * *");
});

Deno.test("60分以上の場合は時間単位のcron文字列を正しく生成する", () => {
  assertEquals(convertToCron(60), "0 */1 * * *");
  assertEquals(convertToCron(120), "0 */2 * * *");
  assertEquals(convertToCron(720), "0 */12 * * *");
  assertEquals(convertToCron(1440), "0 0 * * *");
});

Deno.test("60の倍数でない60分以上の値に対してはエラーをスローする", () => {
  assertThrows(() => convertToCron(61), Error);
  assertThrows(() => convertToCron(90), Error);
  assertThrows(() => convertToCron(1500), Error);
});

Deno.test("0分や1441分など範囲外の値に対してはエラーをスローする", () => {
  assertThrows(() => convertToCron(0), Error);
  assertThrows(() => convertToCron(1441), Error);
});
