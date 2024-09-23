import crypto from "crypto";

export function calculateHash256(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}
