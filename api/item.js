export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { id } = req.query;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [catalogRes, thumbRes] = await Promise.all([
      fetch(`https://catalog.roblox.com/v1/catalog/items/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ itemType: "Asset", id: Number(id) }] })
      }),
      fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`)
    ]);

    const catalogJson = await catalogRes.json();
    const thumbJson = await thumbRes.json();

    const name = catalogJson?.data?.[0]?.name || null;
    const imageUrl = thumbJson?.data?.[0]?.imageUrl || null;

    res.status(200).json({ id, name, imageUrl });
  } catch (e) {
    res.status(500).json({ error: "Roblox fetch failed", detail: e.message });
  }
}
