// Usage: npm run hash-password -- "your-admin-password"
// Prints ADMIN_PASSWORD_HASH and a fresh SESSION_SECRET to paste into Netlify env vars.
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Give a password of 12+ characters: npm run hash-password -- "my long password"');
  process.exit(1);
}
console.log(`ADMIN_PASSWORD_HASH=${bcrypt.hashSync(password, 12)}`);
console.log(`SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
