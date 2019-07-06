var stats = {
    health: 3,
    restart_timeout: null,
    reload_time: 3
}

function UIHandler() {
    
    this.heart_image_index = 30;
    this.heart_size = 25;
    this.heart_padding = 6;
    this.heart_y_pos = 25;
    this.heart_x_pos = front_canvas.width/2 - 1.5 * (this.heart_size + this.heart_padding);

}

UIHandler.prototype.UI = function () {
    this.healthUI();
}

UIHandler.prototype.healthUI = function() {
    for (let i = 0; i < stats.health; i++) {
        var x = this.heart_x_pos + this.heart_size * i + this.heart_padding * i;
        draw(this.heart_image_index, front_ctx, x, this.heart_y_pos, this.heart_size);
    }
}