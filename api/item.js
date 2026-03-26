export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { id } = req.query;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [infoRes, thumbRes] = await Promise.all([
      fetch(`https://www.roblox.com/marketplace/productinfo?assetId=${id}`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      }),
      fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`, {
        headers: { "User-Agent": "Mozilla/5.0" }
      })
    ]);

    const info = await infoRes.json();
    const thumb = await thumbRes.json();

    const name = info.Name || null;
    const imageUrl = thumb?.data?.[0]?.imageUrl || null;

    res.status(200).json({ id, name, imageUrl });
  } catch (e) {
    res.status(500).json({ error: "Roblox fetch failed", detail: e.message });
  }
}
