var propsHandler = null;

function Tile_Sheet(src) {
    this.src = src;
    this.columns = 13;
    this.lines = 12;
    this.tile_size = 40;
    this.image = new Image(this.columns * this.tile_size, this.lines * this.tile_size);
    this.image.onload = function() {
        map.draw();
        propsHandler = new PropsHandler();
    }
    this.image.src = src;
    this.door_open_image_index = 20;
    this.door_closed_image_index = 21;
}

function Map() {
    this.tile_sheet = new Tile_Sheet("./tileset.png");
    this.columns = 27;
    this.lines = 13;
    this.canvas = document.getElementById("backcanvas");
    this.tile_size = Math.floor(this.canvas.width/this.columns);
    
    this.walkableX = [this.tile_size/2, this.canvas.width - this.tile_size / 2];
    this.walkableY = [this.tile_size, this.canvas.height - this.tile_size];

    // DO NOT take care about this tilemap, it's not used
    this.map = [
        9, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8,
        14, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 15,
        10, 1, 2, 1, 2, 1, 3, 1, 4, 1, 1, 4, 1, 2, 4, 2, 1, 2, 1, 4, 2, 4, 1, 4, 3, 1, 12,
        10, 4, 2, 2, 3, 2, 2, 4, 1, 4, 2, 2, 2, 4, 1, 2, 1, 1, 4, 4, 2, 4, 2, 1, 4, 2, 13,
        11, 1, 4, 2, 1, 4, 2, 2, 4, 2, 2, 1, 2, 3, 2, 4, 1, 4, 3, 2, 1, 4, 2, 4, 1, 4, 12,
        10, 1, 4, 1, 1, 2, 3, 1, 1, 2, 1, 4, 1, 1, 4, 1, 2, 4, 1, 4, 1, 4, 4, 2, 2, 3, 12,
        11, 4, 4, 2, 1, 2, 1, 4, 2, 4, 1, 2, 1, 2, 1, 2, 2, 2, 4, 2, 4, 4, 2, 4, 2, 4, 13,
        10, 1, 2, 1, 2, 4, 2, 1, 4, 1, 1, 4, 1, 2, 1, 4, 2, 4, 4, 1, 4, 2, 3, 1, 2, 1, 12,
        10, 2, 1, 3, 4, 2, 2, 4, 1, 4, 2, 3, 2, 4, 3, 1, 4, 2, 4, 1, 2, 2, 4, 4, 4, 1, 13,
        11, 1, 4, 2, 1, 4, 2, 2, 4, 2, 2, 1, 2, 4, 1, 2, 4, 1, 4, 4, 2, 4, 2, 1, 4, 2, 12,
        10, 1, 4, 1, 1, 2, 3, 1, 1, 2, 1, 4, 1, 1, 1, 4, 2, 4, 1, 2, 4, 1, 2, 4, 1, 2, 12,
        11, 3, 4, 2, 1, 2, 1, 4, 2, 4, 3, 2, 1, 2, 2, 1, 2, 4, 2, 4, 2, 4, 3, 2, 4, 2, 13,
        16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];

    this.door_open_pos =  [this.canvas.width/6, this.tile_size];
    this.door_closed_pos = [this.canvas.width - this.canvas.width/6, this.tile_size];

    gameManager.player_door_dst = this.tile_size/2;

}
Map.prototype.draw = function() {

    // Map background
    for (var i in this.map) {
        if (this.map[i] != 1 && this.map[i] != 4 && this.map[i] != 2) {
            var dx = (i%this.columns) * this.tile_size;
            var dy = Math.floor(i/this.columns) * this.tile_size;
            draw(this.map[i], this.canvas.getContext("2d"), dx, dy);
        }
    }

    // Doors
    draw(this.tile_sheet.door_closed_image_index, this.canvas.getContext("2d"), this.door_open_pos[0], this.door_open_pos[1]);
    draw(this.tile_sheet.door_closed_image_index, this.canvas.getContext("2d"), this.door_closed_pos[0], this.door_closed_pos[1]);

    gameManager.propsDrawer();

}

function draw(image_index, ctx, dx, dy, edge_size = map.tile_size, sprite = map.tile_sheet.image, nbColumns = map.tile_sheet.columns) {
    image_index -= 1;
    var sx = (image_index % nbColumns) * map.tile_sheet.tile_size;
    var sy = Math.floor(image_index / nbColumns) * map.tile_sheet.tile_size;
    
    ctx.drawImage(sprite, sx, sy, map.tile_sheet.tile_size, map.tile_sheet.tile_size, dx, dy, edge_size, edge_size);
}