export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  const { id } = req.query;
  if (!id || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/json,*/*",
  };

  try {
    // Fetch catalog page HTML + thumbnail in parallel
    const [pageRes, thumbRes] = await Promise.all([
      fetch(`https://www.roblox.com/catalog/${id}/x`, { headers }),
      fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`, { headers })
    ]);

    const html = await pageRes.text();
    const thumb = await thumbRes.json();

    // Extract name from og:title meta tag — more reliable than <title>
    const ogMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)
                 || html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    const name = ogMatch ? ogMatch[1].trim() : null;

    const imageUrl = thumb?.data?.[0]?.imageUrl || null;

    res.status(200).json({ id, name, imageUrl });
  } catch (e) {
    res.status(500).json({ error: "Roblox fetch failed", detail: e.message });
  }
}
