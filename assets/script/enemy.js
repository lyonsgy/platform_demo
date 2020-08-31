
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hp = 5
        this.isHit = false
        this.ani = this.node.getChildByName('body').getComponent(cc.Animation)

        this.ani.on('finished', this.onAnimaFinished, this)
    },

    onAnimaFinished (e, data) {
        this.hp--
        this.isHit = false
        if (this.hp === 0) {
            this.node.destroy()
        }
    },

    hurt () {
        console.log(this.hp)
        this.isHit = true
        this.ani.play('hurt')
    },

    update (dt) { },
});
