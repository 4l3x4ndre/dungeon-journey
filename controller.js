function Player() {
    this.canvas = front_canvas;

    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.size = map.tile_size;

    this.speed = 3;
    this.velY = 0;
    this.velX = 0;
    this.direction = "left";

    this.tile_index = 20;

    this.inputs = {
        right: false,
        left: false,
        up: false,
        down: false,
        shoot: false
    }

    this.can_shoot = true;
    this.fire_rate = 1;

    this.dst_open_door = 0;

    // Player's arrow settings
    this.start_arrow_offset_x = 30;
    this.arrow_offset_y = 15;

    // Tileset settings
    this.tile_size = 40;
    this.tileset_columns = 13;
    this.tileset_lines = 1;
    this.image = new Image(this.tileset_columns * this.tile_size, this.tileset_lines * this.tile_size);
    this.image.src = "./knight_tileset.png";

    this.anime_speed_idle = .66;
    this.anime_speed_move = .1;
    this.anime_speed = this.anime_speed_idle;
    this.last_direction = "left";
    this.left_sprites = [1, 2, 3, 4];
    this.right_sprites = [5, 6, 7, 8];
    this.face_sprites = [9, 10, 11, 12];
    this.back_sprites = [13, 14, 15, 16];
    this.sprite_id = 0;
    this.can_change_sprite = true;
    this.current_sprites = this.left_sprites;
    this.current_sprite_index = this.current_sprites[this.sprite_id];
    this.sprite_intervall == null;
}

Player.prototype.anime = function () {
    if (this.can_change_sprite ||
        (this.current_sprites == this.back_sprites && this.direction != "up") ||
        (this.current_sprites == this.face_sprites && this.direction != "down") ||
        (this.current_sprites == this.right_sprites && this.direction != "right") ||
        (this.current_sprites == this.left_sprites && this.direction != "left")) {
    

        if (this.direction == "up") {
            this.current_sprites = this.back_sprites;
            if (this.inputs.up) {
                this.anime_speed = this.anime_speed_move;
            } else {
                this.anime_speed = this.anime_speed_idle;
            }
        } else if (this.direction == "down") {
            this.current_sprites = this.face_sprites;
            if (this.inputs.down) {
                this.anime_speed = this.anime_speed_move;
            } else {
                this.anime_speed = this.anime_speed_idle;
            }
        } else if (this.direction == "right") {
            this.current_sprites = this.right_sprites;
            if (this.inputs.right) {
                this.anime_speed = this.anime_speed_move;
            } else {
                this.anime_speed = this.anime_speed_idle;
            }
        } else if (this.direction == "left") {
            this.current_sprites = this.left_sprites;
            if (this.inputs.left) {
                this.anime_speed = this.anime_speed_move;
            } else {
                this.anime_speed = this.anime_speed_idle;
            }
        }

        if (this.sprite_id >= 4) {
            this.sprite_id = 0;
        }
        this.current_sprite_index = this.current_sprites[this.sprite_id];
        this.sprite_id++;


        this.can_change_sprite = false;
        //console.log(this.sprite_id);
        if (this.sprite_intervall == null) {
            this.sprite_intervall = setTimeout(this.changeSprite.bind(this), this.anime_speed * 1000);
        }
    }
}

Player.prototype.changeSprite = function() {
    this.sprite_intervall = null;
    this.can_change_sprite = true;
}

Player.prototype.move = function() {
    this.dst_open_door = Math.sqrt(Math.pow(this.x - map.door_open_pos[0], 2) + Math.pow(this.y - map.door_open_pos[1], 2));

    if (this.inputs.right) {
        this.velX = this.speed;
        this.direction = "right";
        this.last_direction = "right";
    } else if (this.inputs.left) {
        this.velX = -this.speed;
        this.direction = "left";
        this.last_direction = "left";
    } else {
        this.velX = 0;
    }

    if (this.inputs.up) {
        this.velY = -this.speed;
        this.direction = "up";
        this.last_direction = "up";
    } else if (this.inputs.down) {
        this.velY = this.speed;
        this.direction = "down";
        this.last_direction = "down";
    } else {
        this.velY = 0;
    }

    for (var i in props) {
        t = collision(this, props[i], this.size, props[i].size);
        if (this.velX > 0 && t[0]) {
            this.x = props[i].x - this.size;
            this.velX = 0;
        }
        if (this.velX < 0 && t[1]) {
            this.x = props[i].x + props[i].size;
            this.velX = 0;
        }
        if (this.velY > 0 && t[2]) {
            this.y = props[i].y - this.size;
            this.velY = 0;
        }
        if (this.velY < 0 && t[3]) {
            this.y = props[i].y + props[i].size;
            this.velY = 0;
        }
    }

    // Walls map collision
    if (this.velX > 0 && this.x + this.size + this.velX > map.walkableX[1]) {
        this.velX = 0;
    } else if (this.velX < 0 && this.x + this.velX < map.walkableX[0]) {
        this.velX = 0;
    }
    if (this.velY > 0 && this.y + this.size + this.velY > map.walkableY[1]) {
        this.velY = 0;
    } else if (this.velY < 0 && this.y + this.velY < map.walkableY[0]) {
        this.velY = 0;
    }

    this.x += this.velX;
    this.y += this.velY;
    
    // Player's arrow drawing
    var arrow_image_index = bullet_specs.image_index_player;
    this.arrow_x_offset = this.start_arrow_offset_x;
    this.arrow_y_offset = 0;
    if (this.direction == "right") {
        arrow_image_index += 1;
    } else if (this.direction == "up") {
        arrow_image_index += 2;
        this.arrow_x_offset = 25;
    } else if (this.direction == "down") {
        arrow_image_index += 3;
        this.arrow_x_offset = -5;
        this.arrow_y_offset = 5;
    } else {
        this.arrow_x_offset = -this.start_arrow_offset_x/3;
    }
    if (this.sprite_id != 4) {
        this.arrow_y_offset += this.sprite_id;
    } else {
        this.arrow_y_offset += 2;
    }

    if (stats.health > 0) {
        draw(arrow_image_index, front_ctx, this.x + this.arrow_x_offset, this.y + this.size/4 + this.arrow_y_offset, bullet_specs.size); 

        // Player drawing
        draw(this.current_sprite_index, this.canvas.getContext("2d"), this.x, this.y, map.tile_size, this.image, this.tileset_columns);
    }
}

Player.prototype.shoot = function() {
    if(this.inputs.shoot && this.can_shoot) {
        this.can_shoot = false;
        setTimeout(playerFireRate, this.fire_rate * 1000);
        console.log("shoot");
        new Bullet(this.x + this.arrow_x_offset, this.y + this.size/4 + this.arrow_y_offset, true, this.direction);
    }
}

Player.prototype.looseLife = function() {
    stats.health -= 1;
    if (stats.health < 0) {
        return;
    }
    new Effect(this.x, this.y, "hit");
}

function playerFireRate() {
    player.can_shoot = true;
}