<input id="searchInput" placeholder="搜尋C影片">
<button onclick="doSearch()">搜尋</button>

<h2>結果</h2>
<div id="results"></div>

<iframe id="player" width="100%" height="480" allowfullscreen></iframe>

<script>
function doSearch() {
  const keyword = document.getElementById("searchInput").value;
  const results = document.getElementById("results");
  results.innerHTML = "";

  // 直接產生 YouTube 搜尋結果
  for (let i = 1; i <= 5; i++) {
    const ytUrl = `https://www.youtube.com/watch?v=dQw4w9WgXcQ`; // 範例固定影片，可改成動態
    const div = document.createElement("div");
    div.innerHTML = `YouTube 影片 ${i} <button onclick="playVideo('YouTube','${ytUrl}')">播放</button>`;
    results.appendChild(div);
  }

  // 直接產生 Bilibili 搜尋結果
  for (let i = 1; i <= 5; i++) {
    const biliUrl = `https://www.bilibili.com/video/BV1x5411c7Xg`; // 範例固定影片，可改成動態
    const div = document.createElement("div");
    div.innerHTML = `Bilibili 影片 ${i} <button onclick="playVideo('Bilibili','${biliUrl}')">播放</button>`;
    results.appendChild(div);
  }
}

function playVideo(platform, url) {
  const player = document.getElementById("player");
  if (platform === "YouTube") {
    // 轉成 iframe embed
    const videoId = url.split("v=")[1];
    player.src = `https://www.youtube.com/embed/${videoId}`;
  } else if (platform === "Bilibili") {
    player.src = `https://player.bilibili.com/player.html?bvid=${url.split("/video/")[1]}`;
  }
}
</script>
