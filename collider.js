var t = [false, false, false, false];
function collision(a, b) {

    // right collision
    t[0] = a.x + a.size >= b.x && a.x < b.x &&
        ((a.y > b.y && a.y < b.y + b.size) || (a.y + a.size > b.y && a.y + a.size < b.y + b.size)
        || a.y == b.y || a.y + a.size == b.y + b.size);
    
    // left collision
    t[1] = a.x <= b.x + b.size && a.x + a.size > b.x + b.size &&
        ((a.y > b.y && a.y < b.y + b.size) || (a.y + a.size > b.y && a.y + a.size < b.y + b.size)
        || a.y == b.y || a.y + a.size == b.y + b.size);
    
    // bottom  collision
    t[2] = a.y + a.size >= b.y && a.y < b.y &&
        ((a.x > b.x && a.x < b.x + b.size) || (a.x + a.size > b.x && a.x + a.size < b.x + b.size)
        || a.x == b.x || a.x + a.size == b.x + b.size); 

    // up collision
    t[3] = a.y <= b.y + b.size && a.y + a.size > b.y + b.size &&
        ((a.x > b.x && a.x < b.x + b.size) || (a.x + a.size > b.x && a.x + a.size < b.x + b.size)
        || a.x == b.x || a.x + a.size == b.x + b.size);
    
    return t;

}