const proxy = "https://cors.zme.ink/";

function doSearch() {
  const keyword = document.getElementById("searchInput").value;
  document.getElementById("results").innerHTML = "搜尋中...";

  Promise.allSettled([
    searchYouTube(keyword),
    searchBilibili(keyword)
  ]).then(results => {

    const yt = results[0].status === "fulfilled" ? results[0].value : [];
    const bili = results[1].status === "fulfilled" ? results[1].value : [];

    const merged = [...yt, ...bili];

    if (merged.length === 0) {
      document.getElementById("results").innerHTML =
        "找不到影片（可能是來源網站封鎖或 proxy 失效）";
      return;
    }

    renderVideos(merged);
  });
}

// ---------- YouTube ----------
async function searchYouTube(keyword) {
  const url = proxy + encodeURIComponent(
    "https://www.youtube.com/results?search_query=" + keyword
  );

  const res = await fetch(url);
  const html = await res.text();

  const matches = [...html.matchAll(/"videoId":"(.*?)"/g)];

  return matches.slice(0, 10).map(m => ({
    platform: "YouTube",
    videoId: m[1],
    title: "YouTube 影片",
    thumbnail: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
  }));
}

// ---------- Bilibili ----------
async function searchBilibili(keyword) {
  const url = proxy + encodeURIComponent(
    "https://search.bilibili.com/all?keyword=" + keyword
  );

  const res = await fetch(url);
  const html = await res.text();

  const matches = [...html.matchAll(/www\.bilibili\.com\/video\/(BV\w+)/g)];

  return matches.slice(0, 10).map(m => ({
    platform: "Bilibili",
    videoId: m[1],
    title: m[1],
    thumbnail: ""
  }));
}

// ---------- 渲染 ----------
function renderVideos(videos) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  videos.forEach(v => {
    container.innerHTML += `
      <div class="card" onclick="playVideo('${v.platform}', '${v.videoId}')">
        ${v.thumbnail ? `<img src="${v.thumbnail}">` : ""}
        <div class="title">${v.title}</div>
        <div class="sourceTag">${v.platform}</div>
      </div>
    `;
  });
}

function playVideo(platform, id) {
  const player = document.getElementById("player");

  if (platform === "YouTube") {
    player.src = `https://www.youtube.com/embed/${id}`;
  } else {
    player.src = `https://www.bilibili.com/player.html?bvid=${id}`;
  }
}
