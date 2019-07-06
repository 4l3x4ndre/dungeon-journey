var FXSpec = {
    hit_array: [31, 32, 33, 34],
    hit_change_sprite_time: .1,
    hit_element_size: 40
}

var effects = {};
var effects_index = 0;

function Effect(x, y, type) {
    this.x = x;
    this.y = y;

    this.array = []; 
    this.size = map.tile_size;
    this.anime_speed = 1;

    this.type = type;
    if (type == "hit") {
        this.array = FXSpec.hit_array;
        this.size = FXSpec.hit_element_size;
        this.anime_speed = FXSpec.hit_change_sprite_time;
    }

    this.can_change_sprite = true;
    this.change_intervall = null;
    this.sprite_id = 0;
    this.current_sprite = this.array[this.sprite_id];

    this.id = effects_index;
    effects[effects_index] = this;
    effects_index ++;
}

Effect.prototype.anime = function() {
    draw(this.current_sprite, front_ctx, this.x, this.y, this.size);
    if (this.can_change_sprite) {
        if (this.sprite_id > this.array.length-1) {
            delete effects[this.id];
        } else {
            this.current_sprite = this.array[this.sprite_id];

            this.can_change_sprite = false;
            this.sprite_id ++;

            if (this.change_intervall == null) {
                this.change_intervall = setTimeout(this.allowChangeSprite.bind(this), this.anime_speed * 1000);
            }
        }
    }
}

Effect.prototype.allowChangeSprite = function() {
    this.change_intervall = null;
    this.can_change_sprite = true;
}