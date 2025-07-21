import { assertEquals } from "@std/assert";
import { exists } from "@std/fs/exists";
import { createLogger } from "./logger.ts";

const TEST_LOG_DIR = "./test_logs";
const TEST_LOG_FILE = `${TEST_LOG_DIR}/test.log`;

async function cleanupTestLogDir() {
  try {
    await Deno.remove(TEST_LOG_DIR, { recursive: true });
  } catch {
    // ignore errors if the directory does not exist
  }
}

Deno.test("createLogger - ログディレクトリが存在しない場合に作成される", async () => {
  // Arrange
  cleanupTestLogDir();

  // Act
  assertEquals(await exists(TEST_LOG_DIR), false);
  await createLogger(TEST_LOG_FILE);

  // Assert
  assertEquals(await exists(TEST_LOG_DIR), true);

  cleanupTestLogDir();
});

Deno.test("createLogger - ログディレクトリが既に存在する場合にログ出力関数が作成される", async () => {
  // Arrange
  cleanupTestLogDir();
  await Deno.mkdir(TEST_LOG_DIR, { recursive: true });
  assertEquals(await exists(TEST_LOG_DIR), true);

  // Act
  const logger = await createLogger(TEST_LOG_FILE);

  // Assert
  assertEquals(typeof logger.log, "function");

  cleanupTestLogDir();
});

Deno.test("Logger.log - メッセージをファイルに書き込む", async () => {
  // Arrange
  cleanupTestLogDir();

  const logger = await createLogger(TEST_LOG_FILE);
  const testMessage = "テストメッセージ";

  // Act
  await logger.log(testMessage);

  // Assert
  const content = await Deno.readTextFile(TEST_LOG_FILE);
  assertEquals(content, testMessage + "\n");

  cleanupTestLogDir();
});

Deno.test("Logger.log - 複数回の書き込み（追記モードの確認）", async () => {
  // Arrange
  cleanupTestLogDir();

  const logger = await createLogger(TEST_LOG_FILE);

  // 最初のメッセージを書き込み
  await logger.log("最初のメッセージ");
  let content = await Deno.readTextFile(TEST_LOG_FILE);
  assertEquals(content, "最初のメッセージ\n");

  // 2番目のメッセージを書き込み（追記されることを確認）
  await logger.log("2番目のメッセージ");
  content = await Deno.readTextFile(TEST_LOG_FILE);
  assertEquals(content, "最初のメッセージ\n2番目のメッセージ\n");

  cleanupTestLogDir();
});

Deno.test("Logger.log - 空文字列の処理", async () => {
  // Arrange
  cleanupTestLogDir();

  const logger = await createLogger(TEST_LOG_FILE);

  // 空文字列を書き込み
  await logger.log("");

  // ファイルが作成され、改行のみの内容であることを確認
  assertEquals(await exists(TEST_LOG_FILE), true);
  const content = await Deno.readTextFile(TEST_LOG_FILE);
  assertEquals(content, "\n");

  cleanupTestLogDir();
});

Deno.test("Logger.log - 特殊文字を含むメッセージの処理", async () => {
  // Arrange
  cleanupTestLogDir();

  const logger = await createLogger(TEST_LOG_FILE);
  const specialMessage = "特殊文字: 🚀 改行\n タブ\t 引用符\"'";

  // 特殊文字を含むメッセージを書き込み
  await logger.log(specialMessage);

  // ファイルの内容を確認（改行文字が追加されることを確認）
  const content = await Deno.readTextFile(TEST_LOG_FILE);
  assertEquals(content, specialMessage + "\n");

  cleanupTestLogDir();
});

Deno.test("Logger.log - 複数行の追記", async () => {
  // Arrange
  cleanupTestLogDir();

  const logger = await createLogger(TEST_LOG_FILE);

  // 複数のメッセージを書き込み
  for (let i = 1; i <= 5; i++) {
    await logger.log(`メッセージ ${i}`);
  }

  // ファイルの内容を確認（すべてのメッセージが追記されていることを確認）
  const content = await Deno.readTextFile(TEST_LOG_FILE);
  const expected = "メッセージ 1\n" +
    "メッセージ 2\n" +
    "メッセージ 3\n" +
    "メッセージ 4\n" +
    "メッセージ 5\n";

  assertEquals(content, expected);

  cleanupTestLogDir();
});
