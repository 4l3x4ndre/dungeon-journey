function EnemiesHandler() {
    this.enemy_density = [1, 3, 5, 2, 5, 9, 12, 17, 19];
    this.shooter_density = [0, 0, 1, 3, 4, 4];

}

EnemiesHandler.prototype.setEnemies = function() {    
    var level = gameManager.current_level;

    for (var i in level) {
        if (level[i] == 1 || level[i] == 2) {
            var dx = (i%map.columns) * map.tile_size;
            var dy = Math.floor(i/map.columns) * map.tile_size;
            
            var spec;
            if (level[i] == 1) {
                spec = walker_specs;
            } else if (level[i] == 2) {
                spec = shooter_specs;
            }

            var enemy = new Enemy(dx, dy, spec);

        }
    }

}