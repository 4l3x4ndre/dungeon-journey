function keyDownHandler(event) {
    if (event.keyCode == 32) {
        player.inputs.shoot = true;
    }
    if (event.keyCode == 39) {
        player.inputs.right = true;
    }
    if (event.keyCode == 37) {
        player.inputs.left = true;
    }
    if (event.keyCode == 38) {
        player.inputs.up = true;
    }
    if (event.keyCode == 40) {
        player.inputs.down = true;
    }
}
function keyUpHandler(event) {
    if (event.keyCode == 32) {
        player.inputs.shoot = false;
    }
    if (event.keyCode == 39) {
        player.inputs.right = false;
    }
    if (event.keyCode == 37) {
        player.inputs.left = false;
    }
    if (event.keyCode == 38) {
        player.inputs.up = false;
    }
    if (event.keyCode == 40) {
        player.inputs.down = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);