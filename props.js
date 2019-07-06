var props = {}
var props_index = 0;
var props_tile_index = [17, 19];

function Prop(x, y, tile_index) {
    this.x = x;
    this.y = y;
    this.size = map.tile_size;
    this.tile_index = tile_index
    this.props_id = props_index;
}

function PropsHandler() {
    this.density = 5;
}

PropsHandler.prototype.setProps = function() {
    for (var i=0; i<this.density; i++) {
        var minY = map.walkableY[0] + map.tile_size;
        var x = Math.random() * ((map.walkableX[1] - map.tile_size) - map.walkableX[0]) + map.walkableX[0];
        var y = Math.random() * ((map.walkableY[1] - map.tile_size) - minY) + minY;
        var tile_index = Math.round(Math.random() * (props_tile_index[1] - props_tile_index[0]) + props_tile_index[0]);

        props[props_index] = new Prop(x, y, tile_index);
        
        draw(tile_index, document.getElementById("backcanvas").getContext("2d"), x, y);
        
        props_index ++;
    }
}

PropsHandler.prototype.clearProps = function() {
    for (var i in props) {
        delete props[i];
    }
    back_ctx.clearRect(0, 0, front_canvas.width, front_canvas.height);
    map.draw();
    props_index = 0;
}