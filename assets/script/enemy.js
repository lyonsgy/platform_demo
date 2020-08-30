
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hp = 5
        this.isHit = false
        this.ani = this.node.getComponent(cc.Animation)

        this.ani.on('finished', this.onAnimaFinished, this)
    },

    onAnimaFinished (e, data) {
        this.hp--
        this.isHit = false
        if (this.hp === 0) {
            this.node.destroy()
        }
    },

    // 碰撞回调
    onCollisionEnter (other, self) {
        let bc = other.getComponent(cc.BoxCollider)
        if (other.node.group === 'hero' && bc.size.width * bc.size.height > 0) {
            this.isHit = true
            this.ani.play('hurt')
        }
    },

    update (dt) { },
});
