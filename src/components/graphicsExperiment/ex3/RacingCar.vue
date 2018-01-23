<template>
    <div>
        <h1>RacingCar</h1>
        <el-button type="text" @click="dialogVisible = true">程序说明</el-button>
        <canvas style="width: 100%"
                ref="targetCanvas"/>
        <el-dialog
            title="程序说明"
            :visible="dialogVisible"
            width="70%">
            <ul>
                <li>
                    <h2>操作说明</h2>
                    <ul>
                        <li>W、A、S、D控制方向</li>
                        <li>T切换视角(上方视角和车内视角)</li>
                        <li><em>如果出现无法操作的情况 可能是窗口没有正确的获取焦点 点击一下画面即可</em></li>
                    </ul>
                </li>
                <li>
                    <h2>技术要点</h2>
                    <ul>
                        <li>几何体的仿射变换:车辆移动\汽车模型的生成(基本几何体的组合)\在转向时车轮的定位</li>
                        <li>相机的使用:固定视角的正交投影相机\移动视角的透视投影相机</li>
                        <li>光照的使用:环境光提亮场景\点光源</li>
                        <li>材质的应用:汽车的高光表面\半透明车前玻璃\</li>
                        <li>纹理的应用:草地纹理映射\车轮贴图(可能两个视角都看不到??)</li>
                    </ul>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button></span>
        </el-dialog>
    </div>

</template>

<script>
    import {init as rendererInit} from './renderer'
    import VehicleControlPanel from './objects/vehicle/VehicleControlPanel'
    import {vehicle} from "./scene";
    import * as THREE from 'three'
    import {switchCamera} from "./refreshController";


    let keyCode = {
        W: 87,
        S: 83,
        A: 65,
        D: 68,
        T: 84
    }

    export default {
        name: "racing-car",
        components: {
            VehicleControlPanel
        },
        mounted() {
            rendererInit({canvas: this.$refs.targetCanvas})

            // 绑定键盘时事件
            document.addEventListener('keyup', this.updatePressingKey_up)
            document.addEventListener('keydown', this.updatePressingKey_down)
        },
        destroyed(){

            // 绑定键盘时事件
            document.removeEventListener('keyup', this.updatePressingKey_up)
            document.removeEventListener('keydown', this.updatePressingKey_down)
        },
        data() {
            return {
                dialogVisible: true
            }
        },
        methods: {
            accelerate() {
                vehicle.accelerate()
            },
            brake() {
                vehicle.brake()
            },
            release() {
                vehicle.release()
            },
            turnLeft() {
                vehicle.turnLeft()
            },
            turnRight() {
                vehicle.turnRight()
            },
            goStraight() {
                vehicle.goStraight()
            },
            switchCamera() {
                switchCamera()
            },
            // 按下时更新
            updatePressingKey_down(e) {
                switch (e.keyCode) {
                    case keyCode.W: {
                        this.accelerate()
                        break
                    }
                    case keyCode.S: {
                        this.brake()
                        break
                    }
                    case keyCode.A: {
                        this.turnLeft()
                        break
                    }
                    case keyCode.D: {
                        this.turnRight()
                        break
                    }
                }
            },
            //松开时更新
            updatePressingKey_up(e) {
                switch (e.keyCode) {
                    case keyCode.W: {
                        if (vehicle.curState !== vehicle.ACCELERATING) return
                        this.release()
                        break
                    }
                    case keyCode.S: {
                        if (vehicle.curState !== vehicle.BRAKING) return
                        this.release()
                        break
                    }
                    case keyCode.A: {
                        if (vehicle.curSteerState !== vehicle.LEFT) return
                        this.goStraight()
                        break
                    }
                    case keyCode.D: {
                        if (vehicle.curSteerState !== vehicle.RIGHT) return
                        this.goStraight()
                        break
                    }
                    case keyCode.T: {
                        this.switchCamera()
                    }
                }
            },
            test() {
                console.log('test')
            }
        }
    }
</script>

<style scoped>

</style>
