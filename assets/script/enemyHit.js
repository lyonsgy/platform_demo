
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
        let bc = other.getComponent(cc.BoxCollider)
        if (other.node.group === 'hero' && bc.size.width * bc.size.height > 0) {
            this.enemy.hurt()
        }
    },
});
