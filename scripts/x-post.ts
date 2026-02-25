import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function loadEnv(envPath: string): void {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Error: ${name} is not set in .claude/.env`);
    process.exit(1);
  }
  return value;
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/\*/g, "%2A")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string,
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");
  const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}

async function postTweet(text: string): Promise<void> {
  const apiKey = requireEnv("X_API_KEY");
  const apiSecret = requireEnv("X_API_SECRET");
  const accessToken = requireEnv("X_ACCESS_TOKEN");
  const accessTokenSecret = requireEnv("X_ACCESS_TOKEN_SECRET");

  const url = "https://api.x.com/2/tweets";
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature("POST", url, oauthParams, apiSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;

  const authHeader =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(", ");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error:", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log(`Posted: https://x.com/i/status/${data.data.id}`);
}

// Main
const envPath = path.resolve(process.cwd(), ".env");
loadEnv(envPath);

const text = process.argv[2];
if (!text) {
  console.error("Usage: npx tsx scripts/x-post.ts <tweet_text>");
  process.exit(1);
}

// X の文字数カウント: URL は 23 文字、CJK/絵文字は 2 文字、ASCII は 1 文字
function countWeightedLength(str: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const withoutUrls = str.replace(urlRegex, "");
  const urlCount = (str.match(urlRegex) || []).length;

  let count = urlCount * 23;
  for (const char of withoutUrls) {
    const code = char.codePointAt(0) || 0;
    // CJK, emoji, and other wide characters count as 2
    const isWide =
      (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
      (code >= 0x2e80 && code <= 0x9fff) || // CJK
      (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
      (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility
      (code >= 0xfe30 && code <= 0xfe6f) || // CJK Forms
      (code >= 0xff01 && code <= 0xff60) || // Fullwidth Forms
      (code >= 0x1f000 && code <= 0x1fbff) || // Emoji/Symbols
      (code >= 0x20000 && code <= 0x2fa1f); // CJK Extension
    count += isWide ? 2 : 1;
  }
  return count;
}

const weightedLength = countWeightedLength(text);
if (weightedLength > 280) {
  console.error(`Error: Tweet is ${weightedLength} weighted chars (max 280)`);
  process.exit(1);
}

postTweet(text);
