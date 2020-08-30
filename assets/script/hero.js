const Input = {}
const State = {
    stand: 1,
    attack: 2,
    jump: 3
}

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._speed = 200
        this.sp = cc.v2(0, 0)

        this.combo = 0

        this.heroState = State.stand
        this.anima = 'idle'
        this.heroAni = this.node.getComponent(cc.Animation)
        this.heroAni.on('finished', this.onAnimaFinished, this)

        cc.systemEvent.on('keydown', this.onKeyDown, this)
        cc.systemEvent.on('keyup', this.onKeyup, this)

    },
    onDestroy () {
        cc.systemEvent.off('keydown', this.onKeyDown, this)
        cc.systemEvent.off('keyup', this.onKeyup, this)
        this.heroAni.off('finished', this.onAnimaFinished, this)
    },

    onAnimaFinished (e, data) {
        if (data.name === 'attack' || data.name === 'attack2' || data.name === 'attack3') {
            this.heroState = State.stand
            this.combo = (this.combo + 1) % 3
            setTimeout(() => {
                if (this.heroState === State.attack) return
                this.combo = 0
            }, 100);
        }
    },

    setAni (anima) {
        if (this.anima === anima) return
        this.anima = anima
        this.heroAni.play(anima)
    },
    onKeyDown (e) {
        Input[e.keyCode] = 1
    },
    onKeyup (e) {
        Input[e.keyCode] = 0
    },
    update (dt) {
        let anima = this.anima
        let scaleX = Math.abs(this.node.scaleX)

        // 利用物理引擎控制移动
        // 拿到 hero 当前的速度
        this.lv = this.node.getComponent(cc.RigidBody).linearVelocity


        switch (this.heroState) {
            case State.stand: {
                if (Input[cc.macro.KEY.j]) {
                    this.heroState = State.attack
                }
                if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up] || Input[cc.macro.KEY.space]) {
                    this.heroState = State.jump
                }
                break;
            }
            case State.attack: {

                break;
            }
            case State.jump: {

                break;
            }
            default:
                break;
        }

        if (this.heroState === State.attack) {
            if (Input[cc.macro.KEY.j]) {
                if (this.combo === 0) {
                    anima = 'attack'
                } else if (this.combo === 1) {
                    anima = 'attack2'
                } else if (this.combo === 2) {
                    anima = 'attack3'
                }
            }
        }

        if (this.heroState != State.stand && this.heroState != State.jump) {
            this.sp.x = 0
        } else {
            // 回到站立状态攻击状态重置为0
            // this.combo = 0
            // 左右移动
            if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
                this.sp.x = -1
                this.node.scaleX = -scaleX
                anima = 'run'
            } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
                this.sp.x = 1
                this.node.scaleX = scaleX
                anima = 'run'
            } else {
                this.sp.x = 0
                anima = 'idle'
            }
        }

        if (this.sp.x) {
            this.lv.x = this.sp.x * this._speed
        } else {
            this.lv.x = 0
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = this.lv

        if (this.heroState === State.jump) {
            if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up] || Input[cc.macro.KEY.space]) {
                anima = 'jump'
                this.jump()
            }
        }
        if (anima) {
            this.setAni(anima)
        }
    },
    jump () {
        let rigidBody = this.node.getComponent(cc.RigidBody)
        console.log(rigidBody.linearVelocity.y)
        if (rigidBody.linearVelocity.y != 0) {
            return
        }
        this.node.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0, 180), this.node.getComponent(cc.RigidBody).getWorldCenter(), true)
    },
});
