var enemies = {};
var enemy_index = 0;

var walker_specs = {
    name: "walker",
    speed: 1,
    image_index: 50,
    size: 42,
    attack_dst : 42,
    attack_rate: 1.5
}
var shooter_specs = {
    name: "shooter",
    speed: .5,
    image_index: 51,
    size: 42,
    shoot_dst: 250,
    fire_rate: 1.75,
    hypotenuse_lenght: 0
}

function Enemy(x, y, spec) {

    this.x = x;
    this.y = y;

    this.direction = "right";
    this.need_to_go = "";
    this.collision_array = [false, false, false, false];

    this.size = map.tile_size;
    this.spec = spec;
    this.angle = 0;
    this.r = Math.random();
    //this.r = 0;
    this.can_shoot = true;

    this.anime_speed = .1;
    this.left_sprites = [1, 2, 3, 4];
    this.right_sprites = [5, 6, 7, 8];
    this.face_sprites = [9, 10, 11, 12];
    this.back_sprites = [13, 14, 15, 16];
    this.wizard_sprites = [17, 18, 19, 20];
    this.sprite_id = 0;
    this.can_change_sprite = true;
    this.current_sprites = this.right_sprites;
    this.current_sprite_index = this.current_sprites[this.sprite_id];
    this.sprite_intervall = null;

    this.id = enemy_index;
    enemies[enemy_index] = this;
    enemy_index ++;

}

Enemy.prototype.anime = function() {
    if (this.can_change_sprite) {

        if (this.spec.name == "walker") {
            if (this.direction == "up") {
                this.current_sprites = this.back_sprites;
            } else if (this.direction == "down") {
                this.current_sprites = this.face_sprites;
            } else if (this.direction == "right") {
                this.current_sprites = this.right_sprites;
            } else if (this.direction == "left") {
                this.current_sprites = this.left_sprites;
            }
        } else {
            this.current_sprites = this.wizard_sprites;
        }

        // Tileset settings
        this.tile_size = 40;
        this.tileset_columns = 13;
        this.tileset_lines = 1;
        this.image = new Image(this.tileset_columns * this.tile_size, this.tileset_lines * this.tile_size);
        this.image.src = "./enemy_tileset.png";

        // Sprites settings
        if (this.sprite_id >= 4) {
            this.sprite_id = 0;
        }
        this.current_sprite_index = this.current_sprites[this.sprite_id];
        this.sprite_id ++;
        this.can_change_sprite = false;
        if (this.sprite_intervall == null) {
            this.sprite_intervall = setTimeout(this.changeSprite.bind(this), this.anime_speed * 1000);
        }
    }
}

Enemy.prototype.changeSprite = function() {
    this.sprite_intervall = null;
    this.can_change_sprite = true;
}

Enemy.prototype.setPosition = function () {
    this.x = Math.random() * (this.maxX - this.minX) + this.minX;
    this.y = Math.random() * (this.maxY - this.minY) + this.minY;
    this.checkPosition();
}

Enemy.prototype.checkPosition = function() {
    // while collide with props, move to other position
    for (var i in props) {
        var p = props[i];
            if ((this.x + this.size >= p.x && this.x + this.size <= p.x + p.size) ||
            (this.x >= p.x && this.x <= p.x + p.size)) {
                if ((this.y >= p.y && this.y <= p.y + p.size) ||
                (this.y + this.size >= p.y && this.y + this.size <= p.y + p.size)) {
                    this.setPosition();
                    return;
                }

            }
    }
}

Enemy.prototype.draw = function() {

    this.move();

    draw(this.current_sprite_index, front_ctx, this.x, this.y, map.tile_size, this.image, this.tileset_columns);
}

Enemy.prototype.move = function() {
    var dst = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
    this.dst = dst;
    this.angle = Math.asin((player.x - this.x)/dst) * (180/Math.PI);

    if (this.spec.name == "walker") {
        this.velX = 0;
        this.velY = 0;
        // Attack or move
        if (dst <= this.spec.attack_dst) {
            this.shoot();
        } else {
            if (this.r > 0.5 || this.need_to_go == "horizontal") {
                // Right, left, down, up
                if (this.x - player.x > 1) {
                    if (!this.collision_array[1]) {
                        this.velX = -this.spec.speed;
                        this.direction = "left";
                    } else {
                        this.velX = 0;
                        this.need_to_go = "vertical";
                    }
                } else if (this.x - player.x < -1) {
                    if (!this.collision_array[0])  {
                        this.velX = this.spec.speed;
                        this.direction = "right";
                    } else {
                        this.velX = 0;
                        this.need_to_go = "vertical";
                    }
                } else if (this.y - player.y > 1 && this.need_to_go != "right") {     
                    if (!this.collision_array[3]) {
                        this.velY = -this.spec.speed;
                        this.direction = "up";
                    } else {
                        this.velY = 0;
                    }
                } else if (this.y - player.y < -1) {
                    if (!this.collision_array[2]) {
                        this.velY = this.spec.speed;
                        this.direction = "down";
                    } else {
                        this.velY = 0;
                    }
                }
            } else  {
                if (this.y - player.y > 1 && this.need_to_go != "right") {     
                    if (!this.collision_array[3]) {
                        this.velY = -this.spec.speed;
                        this.direction = "up";
                    } else {
                        this.velY = 0;
                    }
                } else if (this.y - player.y < -1) {
                    if (!this.collision_array[2]) {
                        this.velY = this.spec.speed;
                        this.direction = "down";
                    } else {
                        this.velY = 0;
                    }
                } else if (this.x - player.x > 1) {
                    if (!this.collision_array[1]) {
                        this.velX = -this.spec.speed;
                        this.direction = "left";
                    } else {
                        this.velX = 0;
                    }
                } else if (this.x - player.x < -1) {
                    if (!this.collision_array[0])  {
                        this.velX = this.spec.speed;
                        this.direction = "right";
                    } else {
                        this.velX = 0;
                    }
                }
            }
            
            // Props collision
            this.collisions = [false, false, false, false];
            for (var i in props) {
                t = collision(this, props[i], this.size, props[i].size);
                if (t[0] == true) {
                    this.collisions[0] = true;
                }
                if (t[1] == true) {
                    this.collisions[1] = true;
                }
                if (t[2] == true) {
                    this.collisions[2] = true;
                }
                if (t[3] == true) {
                    this.collisions[3] = true;
                }
            }
            this.collision_array = this.collisions;
            
            this.x += this.velX;
            this.y += this.velY;

        }
    } else if (this.spec.name == "shooter") {
        this.shoot();
    }
}

Enemy.prototype.shoot = function() {
    if (this.can_shoot) {
        this.can_shoot = false;
        if (this.spec.name == "shooter") {
            new Bullet(this.x + this.size/4, this.y, false, this.direction);
            setTimeout(enemyFireRate, this.spec.fire_rate * 1000, this.id);
        } else {
            setTimeout(enemyFireRate, this.spec.attack_rate * 1000, this.id);
            player.looseLife();
        }
    }
}

function enemyFireRate(id) {
    if (enemies[id] != null) {
        enemies[id].can_shoot = true;
    }
}
