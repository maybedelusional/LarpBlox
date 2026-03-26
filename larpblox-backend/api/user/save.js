// api/user/save.js — POST /api/user/save
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId, equippedItems, fakeInventory, fakeStats } = req.body || {};
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  // Only store what other LarpBlox users are allowed to see
  // Fake Robux is intentionally excluded — that's private
  const publicData = {
    userId,
    equippedItems: equippedItems || [],
    fakeInventory: (fakeInventory || []).map(item => ({
      id: item.id,
      name: item.name,
      thumb: item.thumb || item.imageUrl || ""
    })),
    fakeStats: {
      friends:   fakeStats?.friends   ?? null,
      followers: fakeStats?.followers ?? null,
      following: fakeStats?.following ?? null
    },
    updatedAt: Date.now()
  };

  try {
    await kv.set(`user:${userId}`, publicData, { ex: 60 * 60 * 24 * 30 }); // 30 day TTL
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("KV save error:", err);
    return res.status(500).json({ error: "Failed to save" });
  }
}
