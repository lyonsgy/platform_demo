
const State = {
    stand: 1,
    attack: 2,
    hurt: 3,
}

cc.Class({
    extends: cc.Component,

    properties: {
        vision_field: 150,
        attack_field: 30,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.hp = 5
        this.isHit = false
        this.anima = 'idle'
        this.ani = this.node.getChildByName('body').getComponent(cc.Animation)
        this.rb = this.node.getComponent(cc.RigidBody)

        this._speed = 80
        this.sp = cc.v2(0, 0)
        this.tt = 0

        this.enemyState = State.stand

        this.ani.on('finished', this.onAnimaFinished, this)

        this.moveLeft = false
        this.moveRight = false

        this.playerNode = cc.find('Canvas/bg/hero')
    },

    onAnimaFinished (e, data) {
        if (data.name === 'hurt') {
            this.hp--
            this.isHit = false
            this.enemyState = State.stand
            if (this.hp === 0) {
                this.node.destroy()
            }
        } else if (data.name === 'attack') {
            this.setAni('idle')
            this.enemyState = State.stand
        }
    },

    hurt () {
        if (this.isHit) return
        this.isHit = true
        this.enemyState = State.hurt

        this.lv = this.rb.linearVelocity
        this.lv.x = 0
        this.rb.linearVelocity = this.lv

        this.setAni('hurt')
    },
    // 攻击
    attack () {
        this.setAni('attack')
        this.lv = this.rb.linearVelocity
        this.lv.x = 0
        this.rb.linearVelocity = this.lv
    },
    // 移动
    move () {
        let scaleX = Math.abs(this.node.scaleX)
        this.lv = this.rb.linearVelocity
        // 左右移动
        if (this.moveLeft) {
            this.sp.x = -1
            this.node.scaleX = -scaleX
            this.setAni('run')
        } else if (this.moveRight) {
            this.sp.x = 1
            this.node.scaleX = scaleX
            this.setAni('run')
        } else {
            this.sp.x = 0
            this.setAni('idle')
        }

        if (this.sp.x) {
            this.lv.x = this.sp.x * this._speed
        } else {
            this.lv.x = 0
        }
        this.rb.linearVelocity = this.lv
    },
    // 跳跃
    jump () {
        if (this.rb.linearVelocity.y != 0) return
        this.rb.applyLinearImpulse(cc.v2(0, 140), this.rb.getWorldCenter(), true)
    },
    setAni (anima) {
        if (this.anima === anima) return
        this.anima = anima
        this.ani.play(anima)
    },
    enemyAction (tt) {
        let p_pos = this.playerNode.position
        let e_pos = this.node.position

        let dis = cc.Vec2.distance(e_pos, p_pos)

        if (dis < this.attack_field) {
            console.log('攻击')
            this.moveLeft = false
            this.moveRight = false
            this.enemyState = State.attack
        } else if (dis <= this.vision_field) {
            console.log('追击')
            let v = p_pos.sub(e_pos)
            if (v.x < 0) { // 向左
                this.moveLeft = true
                this.moveRight = false
            } else { // 向右
                this.moveLeft = false
                this.moveRight = true
            }
            this.enemyState = State.stand
        } else {
            console.log('静止')
            this.moveLeft = false
            this.moveRight = false
            this.enemyState = State.stand
        }
    },

    update (dt) {
        // 状态切换
        this.tt += dt

        if (this.tt >= 0.3 && this.enemyState === State.stand) {
            this.enemyAction(dt)
            this.tt = 0
        }

        if (this.enemyState === State.attack) { // 攻击
            this.attack()
        } else if (this.enemyState === State.stand) { // 移动
            this.move()
        }

        // if (this.isJump) { // 跳跃
        //     if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up] || Input[cc.macro.KEY.space]) {
        //         // anima = 'jump'
        //         this.jump()
        //     }
        // }
    },
});
