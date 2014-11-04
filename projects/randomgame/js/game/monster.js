var Monster = function(x, y) {
    this.x = x;
    this.y = y;
    textureMapper.addTexture('monster','img/monster.png');
    this.action = 'standing';
}