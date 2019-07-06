var bullets = {}
var bullet_index = 0;
bullet_specs = {}

function setBulletsSpecs() {
    var specs = {
        image_index_player: 22,
        image_index_enemy: [27, 28, 29, 29],
        anime_speed: .2,
        size: map.tile_size * .5,
        player_bullet_speed: 5,
        enemies_bullet_speed: 2
    }
    return specs;
}

function Bullet(x, y, is_player, direction = "left") {
    this.x = x;
    this.y = y;
    
    this.size = bullet_specs.size;
    this.is_player = is_player;
    
    this.dx = 0;
    this.dy = 0;
    
    this.speed = 0;
    if (is_player) {
        this.speed = bullet_specs.player_bullet_speed;
        this.image_index = bullet_specs.image_index_player;
        if (direction == "right") {
            this.dx = this.speed;
            this.image_index += 1;
        } else if (direction == "left") {
            this.dx = -this.speed;
        } else if (direction == "up") {
            this.dy = -this.speed;
            this.image_index += 2;
        } else {
            this.dy = this.speed;
            this.image_index += 3;
        }
    } else {
        this.speed = bullet_specs.enemies_bullet_speed;
        this.image_index = bullet_specs.image_index_enemy;
        var dst = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
        this.dst = dst;
        this.angle = Math.asin((player.x - this.x)/dst);
        this.hypotenuse_length = (player.x - this.x) / Math.sin(this.angle);
        this.dx = (player.x - this.x)/this.hypotenuse_length * this.speed;
        this.dy = (player.y - this.y)/this.hypotenuse_length * this.speed;
        this.sprite_id = 0;
        this.can_change_sprite = true;
        this.sprite_intervall = null;
        this.current_sprite_index = 0;
    }

    bullets[bullet_index] = this;
    this.id = bullet_index;
    bullet_index ++;

}

Bullet.prototype.anime = function () {
    if (this.can_change_sprite) {
        if (this.sprite_id > bullet_specs.image_index_enemy.length - 2) {
            this.sprite_id = 0;
        }
        this.image_index = bullet_specs.image_index_enemy[this.sprite_id];
        this.sprite_id++;


        this.can_change_sprite = false;
        if (this.sprite_intervall == null) {
            this.sprite_intervall = setTimeout(this.changeSprite.bind(this), bullet_specs.anime_speed * 1000);
        }
    }
}

Bullet.prototype.changeSprite = function() {
    this.sprite_intervall = null;
    this.can_change_sprite = true;
}

Bullet.prototype.draw = function () {
    this.move();

    if (this != null) {
        if (!this.is_player) {
            this.anime();
        }
        draw(this.image_index, front_ctx, this.x, this.y, this.size);
    }
}

Bullet.prototype.move = function() {
    this.x += this.dx;
    this.y += this.dy;

    // Map edges
    if (this.x > front_canvas.width ||
        this.x + this.size < 0 ||
        this.y < map.tile_size ||
        this.y + this.size > front_canvas.height - map.tile_size) {
            delete bullets[this.id];
    }

    // Props collision
    for (var i in props) {
        var p = props[i];
            if ((this.x + this.size >= p.x && this.x + this.size <= p.x + p.size) ||
            (this.x >= p.x && this.x <= p.x + p.size)) {
                if ((this.y >= p.y && this.y <= p.y + p.size) ||
                (this.y + this.size >= p.y && this.y + this.size <= p.y + p.size)) {
                    delete bullets[this.id];
                    return;
                }

            }
    }

    // Player or ennemies collision
    if (!this.is_player) {
        if ((this.x + this.size >= player.x && this.x + this.size <= player.x + player.size) ||
            (this.x >= player.x &&this.x <= player.x + player.size)) {
                if ((this.y >= player.y && this.y <= player.y + player.size) ||
                (this.y + this.size >= player.y && this.y + this.size <= player.y + player.size)) {
                    delete bullets[this.id];
                    player.looseLife();
                    return;

            }
        }
    } else {
        for (var i in enemies) {
            var e = enemies[i];
            if ((this.x + this.size >= e.x && this.x + this.size <= e.x + e.size) ||
            (this.x >= e.x && this.x <= e.x + e.size)) {
                if ((this.y >= e.y && this.y <= e.y + e.size) ||
                (this.y + this.size >= e.y && this.y + this.size <= e.y + e.size)) {
                    delete bullets[this.id];
                    delete enemies[e.id];
                    gameManager.enemiesRemaining --;
                    new Effect(e.x, e.y, "hit");
                    return;
                }
            }
        }
    }

}