cc.Class({
    extends: cc.Component,

    properties: {
        is_debug: false,
        gravity: cc.v2(0, -320), // 系统默认
        mapNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let p = cc.director.getPhysicsManager()
        p.enabled = true
        // 独立的形状，打开一个调试区域，游戏图像的逻辑区域
        // 开始调试
        if (this.is_debug) { // 开启调试信息
            let Bits = cc.PhysicsManager.DrawBits // 这个是我们要显示的类型
            p.debugDrawFlags = Bits.e_jointBit | Bits.e_shapeBit
        } else { // 关闭调试信息
            p.debugDrawFlags = 0
        }
        // 重力加速度配置
        p.gravity = this.gravity

        // 打开碰撞设置
        cc.director.getCollisionManager().enabled = true
        cc.director.getCollisionManager().enabledDebugDraw = this.is_debug

        this.initMapNode(this.mapNode)
    },

    initMapNode (mapNode) {
        let tiledMap = mapNode.getComponent(cc.TiledMap)
        let tiledSize = tiledMap.getTileSize()
        let layer = tiledMap.getLayer('wall')
        let layerSize = layer.getLayerSize()

        for (let i = 0; i < layerSize.width; i++) {
            // 水平方向的块数
            for (let j = 0; j < layerSize.height; j++) {
                // 垂直方向的块数
                let tiled = layer.getTiledTileAt(i, j, true)
                if (tiled.gid != 0) {
                    tiled.node.group = 'wall'
                    let body = tiled.node.addComponent(cc.RigidBody)
                    body.type = cc.RigidBodyType.Static
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider)
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                    collider.size = tiledSize
                    collider.apply()
                }
            }
        }
    },
    // update (dt) {},
});
