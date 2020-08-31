
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.enemy = this.node.parent.getComponent('enemy')
    },

    // 碰撞回调
    onCollisionEnter (other, self) {
        // console.log('enemyTag', self.tag)
        // console.log('heroTag', other.tag)
        if (other.node.group === 'hero' && other.tag === 0 && other.size.width * other.size.height != 0) {
            this.enemy.hurt()
        }
    },
});
