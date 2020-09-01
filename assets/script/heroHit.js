
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hero = this.node.parent.getComponent('hero')
    },

    // 碰撞回调
    onCollisionEnter (other, self) {
        // console.log('__heroTag', self.tag)
        // console.log('__enemyTag', other.tag)
        if (other.node.group === 'enemy' && other.tag === 0 && other.size.width * other.size.height != 0) {
            // 受伤
            console.log('受伤')
            this.hero.hurt()
        }
    },
});
