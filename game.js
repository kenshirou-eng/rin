const teamArea = document.getElementById("team");
const enemyArea = document.getElementById("enemyTeam");
const gachaBtn = document.getElementById("startGacha");
const stageArea = document.getElementById("stageArea");
const battleBtn = document.getElementById("battleBtn");
const battleLog = document.getElementById("battleLog");
const stageTitle = document.getElementById("stageTitle");

let playerTeam = [];
let enemyTeam = [];
let currentStage = 1;

function getRandomCat() {
  const names = ["ハチワレ", "ゴロミ", "マタタビン", "にゃん将軍", "シャドーにゃん"];
  const types = ["攻撃", "回復", "妨害"];
  return {
    name: names[Math.floor(Math.random() * names.length)],
    type: types[Math.floor(Math.random() * types.length)],
    hp: 100,
    level: 1
  };
}

function renderTeam(team, container) {
  container.innerHTML = "";
  team.forEach(cat => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong>${cat.name}</strong><br>タイプ: ${cat.type}<br>HP: ${cat.hp}<br>Lv: ${cat.level}`;
    container.appendChild(card);
  });
}

gachaBtn.onclick = () => {
  playerTeam = [getRandomCat(), getRandomCat(), getRandomCat()];
  renderTeam(playerTeam, teamArea);
  stageArea.style.display = "block";
  loadStage(currentStage);
};

function loadStage(stageNum) {
  stageTitle.textContent = `ステージ ${stageNum}`;
  enemyTeam = [getRandomCat(), getRandomCat()];
  renderTeam(enemyTeam, enemyArea);
}

battleBtn.onclick = () => {
  battleLog.innerHTML = "";
  let playerPower = playerTeam.reduce((sum, cat) => sum + cat.level * 10, 0);
  let enemyPower = enemyTeam.reduce((sum, cat) => sum + cat.level * 10, 0);

  if (playerPower >= enemyPower) {
    battleLog.innerHTML = "🎉 勝利！猫たちがレベルアップ！";
    playerTeam.forEach(cat => cat.level++);
    currentStage++;
    loadStage(currentStage);
    renderTeam(playerTeam, teamArea);
  } else {
    battleLog.innerHTML = "💥 敗北…また挑戦してみよう！";
  }
};
let stages = [];

async function loadStages() {
  const res = await fetch("data/stages.json");
  stages = await res.json();
}

function loadStage(stageNum) {
  stageTitle.textContent = `ステージ ${stageNum}`;
  const stageData = stages[stageNum - 1] || stages[0]; // ループ or fallback
  enemyTeam = stageData.enemies.map(enemy => ({
    name: enemy.name,
    type: enemy.type,
    hp: enemy.hp,
    level: enemy.level
  }));
  renderTeam(enemyTeam, enemyArea);
}

window.onload = async () => {
  await loadStages();
};
