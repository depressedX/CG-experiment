<template>
    <div>
        <h1>RacingCarTitle</h1>
        <canvas style="width: 100%"
            ref="targetCanvas"/>
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
        T:84
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
        data() {
            return {}
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
            switchCamera(){
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
                    case keyCode.T:{
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
