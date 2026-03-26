// api/user/save.js - POST save loadout
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.roblox.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId, displayTag, equippedItems, fakeStats } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  // Only save what other users should see (no fake robux — that's private)
  const publicData = {
    userId,
    displayTag: displayTag || "",
    equippedItems: equippedItems || [],
    fakeStats: fakeStats || {},
    updatedAt: Date.now()
  };

  try {
    await kv.set(`user:${userId}`, publicData, { ex: 60 * 60 * 24 * 30 }); // 30 day TTL
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
