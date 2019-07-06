var enemiesHandler = null;
var player = null;
var map = null;

window.onload = function() {
  map = new Map();
  player = new Player();
  bullet_specs = setBulletsSpecs();
  enemiesHandler = new EnemiesHandler();
  enemiesHandler.setEnemies();
}

var front_canvas = document.getElementById("frontcanvas");
var front_ctx = front_canvas.getContext("2d");

var back_canvas = document.getElementById("backcanvas");
var back_ctx = back_canvas.getContext("2d");

var gameManager = new GameManager();
//gameManager.firstLevel();

var uiHandler = new UIHandler();

function loop() {

  front_ctx.clearRect(0, 0, front_canvas.width, front_canvas.height);
  if (map == null) {
    requestAnimationFrame(loop);
    return;
  }
  if (player != null && stats.health > 0) {
    player.move();
    player.shoot();
    player.anime();
  }

  for (var e in enemies) {
    enemies[e].draw();
    enemies[e].anime();
  }

  for (var b in bullets) {
    bullets[b].draw();
  }

  if (gameManager != null && map != null && stats.health > 0) {
    if (gameManager.lvlId == -1) {
      gameManager.firstLevel();

      // Show controls
      front_ctx.font = "28px serif";
      front_ctx.fillStyle = "#bfbfbf";
      front_ctx.fillText ("Arrow keys to move", front_canvas.width/6, front_canvas.height/2);
      front_ctx.fillText ("Space to shoot", front_canvas.width - front_canvas.width/5, front_canvas.height/2);

    } else if (!gameManager.end) {
      if (gameManager.lvlId == 0) {
        front_ctx.fillText ("Monsters will run after you, kill them", front_canvas.width/5, front_canvas.height - front_canvas.height/3);
      } else if (gameManager.lvlId == 3) {
        front_ctx.fillText ("Wizards throw you fireballs, dodge them", front_canvas.width/5, front_canvas.height - front_canvas.height/3);
      }
    } else {
      front_ctx.fillText ("Thank's to save this dungeon prototype!", front_canvas.width/5, front_canvas.height - front_canvas.height/3);
    }
    gameManager.levelHandler();
  }

  if (uiHandler != null) {
    uiHandler.UI();
  }

  for (var e in effects) {
    effects[e].anime();
  }

  if (stats.health <= 0) {
    front_ctx.fillText ("You died...", front_canvas.width/5, front_canvas.height - front_canvas.height/3);
    if (stats.restart_timeout == null) {
      stats.restart_timeout = setTimeout(restartGame, stats.reload_time * 1000);
    }
  }
  
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function restartGame() {
  document.location.reload();
}