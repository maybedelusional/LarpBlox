export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = req.query;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const [detail, thumb] = await Promise.all([
      fetch(`https://economy.roblox.com/v2/assets/${id}/details`),
      fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`)
    ]);
    const detailJson = await detail.json();
    const thumbJson = await thumb.json();
    res.json({
      id,
      name: detailJson.Name || null,
      imageUrl: thumbJson?.data?.[0]?.imageUrl || null,
    });
  } catch (e) {
    res.status(500).json({ error: "Roblox fetch failed" });
  }
}
