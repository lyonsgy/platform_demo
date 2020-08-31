const Input = {}
const State = {
    stand: 1,
    attack: 2,
    hurt: 3,
    dead: 4,
}

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._speed = 200
        this.sp = cc.v2(0, 0)

        this.isJump = 0
        this.combo = 0

        this.heroState = State.stand
        this.anima = 'idle'
        this.heroAni = this.node.getChildByName('body').getComponent(cc.Animation)
        this.rb = this.node.getComponent(cc.RigidBody)
        this.boxCollider = this.node.getComponent(cc.BoxCollider)
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
    // 攻击
    attack () {
        this.lv = this.rb.linearVelocity
        if (Input[cc.macro.KEY.j]) {
            if (this.combo === 0) {
                this.setAni('attack')
            } else if (this.combo === 1) {
                this.setAni('attack2')
            } else if (this.combo === 2) {
                this.setAni('attack3')
            }
            if (this.rb.linearVelocity.y != 0) { // 跳跃过程中不能连击
                this.setAni('attack')
                this.combo = 0
            }
            this.lv.x = 0
        }
        this.rb.linearVelocity = this.lv
    },
    // 移动
    move () {
        let scaleX = Math.abs(this.node.scaleX)
        // 利用物理引擎控制移动
        // 拿到 hero 当前的速度
        this.lv = this.rb.linearVelocity
        // 左右移动
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.sp.x = -1
            this.node.scaleX = -scaleX
            this.setAni('run')
        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
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
    update (dt) {
        // 状态切换
        switch (this.heroState) {
            case State.stand: {
                if (Input[cc.macro.KEY.j]) {
                    this.heroState = State.attack
                }
                if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up] || Input[cc.macro.KEY.space]) {
                    this.isJump = 1
                }
                break;
            }
            case State.attack: {

                break;
            }
            default:
                break;
        }

        if (this.heroState === State.attack) { // 攻击
            this.attack()
        } else if (this.heroState === State.stand) { // 移动
            this.move()
        } else if (this.heroState === State.hurt) { // 受伤
            this.setAni('hurt')
        }

        if (this.isJump) { // 跳跃
            if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up] || Input[cc.macro.KEY.space]) {
                // anima = 'jump'
                this.jump()
            }
        }
    },

    // 碰撞回调
    onCollisionEnter (other, self) {
        // console.log('__heroTag', self.tag)
        // console.log('__enemyTag', other.tag)
        if (other.node.group === 'enemy' && other.tag === 0 && other.size.width * other.size.height != 0) {
            // 受伤
            console.log('受伤')
            this.heroState = State.hurt
        }
    },
});
