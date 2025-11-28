function doSearch() {
  const keyword = document.getElementById("searchInput").value;
  document.getElementById("results").innerHTML = "搜尋中...";
  Promise.all([searchYouTube(keyword), searchBilibili(keyword)]).then(all => {
    const [yt, bili] = all;
    const merged = [...yt, ...bili];
    renderVideos(merged);
  });
}

/* ---------- YouTube 搜尋（無 API Key 版）---------- */
async function searchYouTube(keyword) {
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    "https://www.youtube.com/results?search_query=" + keyword
  )}`;

  const res = await fetch(url);
  const json = await res.json();
  const html = json.contents;

  const matches = [...html.matchAll(/"videoId":"(.*?)","title":"(.*?)"/g)];

  return matches.slice(0, 10).map(m => ({
    platform: "YouTube",
    videoId: m[1],
    title: decodeURIComponent(JSON.parse(`"${m[2]}"`)),
    thumbnail: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
  }));
}

/* ---------- Bilibili 搜尋 ---------- */
async function searchBilibili(keyword) {
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    "https://search.bilibili.com/all?keyword=" + keyword
  )}`;

  const res = await fetch(url);
  const json = await res.json();
  const html = json.contents;

  const matches = [...html.matchAll(/www.bilibili.com\/video\/(BV[\w]+)/g)];

  return matches.slice(0, 10).map(m => ({
    platform: "Bilibili",
    videoId: m[1],
    title: m[1],
    thumbnail: `https://i1.hdslb.com/bfs/archive/${m[1]}.jpg` // 部分會無圖，介面仍可用
  }));
}

/* ---------- 渲染整合後卡片 ---------- */
function renderVideos(videos) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  videos.forEach(v => {
    container.innerHTML += `
      <div class="card" onclick="playVideo('${v.platform}', '${v.videoId}')">
        <img src="${v.thumbnail}">
        <div class="title">${v.title}</div>
        <div class="sourceTag">${v.platform}</div>
      </div>
    `;
  });
}

/* ---------- 播放器切換 ---------- */
function playVideo(platform, id) {
  const player = document.getElementById("player");

  if (platform === "YouTube") {
    player.src = `https://www.youtube.com/embed/${id}`;
  } else if (platform === "Bilibili") {
    player.src = `https://www.bilibili.com/player.html?bvid=${id}`;
  }
}
