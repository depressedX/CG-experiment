<template>
    <div
        @mouseup="onmouseup">
        <el-button @click="$emit('startUp')">启动</el-button>
        <el-input-number v-model="curGear" @change="test" :min="0" :max="5" label="描述文字"></el-input-number>
        <el-progress :show-text="false" :stroke-width="18" :percentage="progress1"></el-progress>
        <el-progress :show-text="false" :stroke-width="18" :percentage="progress2"></el-progress>
        <div
            @mousedown="onmousedown"
            @mousemove="onmousemove"
            class="touch-panel"
            ref="touchPanel">
            <div class="touch-panel__ball" ref="ball"/>
        </div>
    </div>
</template>

<script>
    function getOffset(dom) {
        let mouse = {};
        let canvasPosition = getElementPosition(dom)
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        mouse.x = (event.clientX + scrollX - canvasPosition.x) / dom.scrollWidth
        mouse.y = (event.clientY + scrollY - canvasPosition.y) / dom.scrollHeight

        function getElementPosition(dom) {
            var x = 0;
            var y = 0;
            while (dom !== null) {
                x += dom.offsetLeft;
                y += dom.offsetTop;
                dom = dom.offsetParent;
            }
            return {x: x, y: y};
        }

        mouse.x = Math.min(1, mouse.x)
        mouse.y = Math.min(1, mouse.y)
        mouse.x = Math.max(0, mouse.x)
        mouse.y = Math.max(0, mouse.y)
        return mouse
    }
    let keyListener

    export default {
        name: "vehicle-control-panel",
        created(){
            keyListener = this.onkeydown.bind(this)
            document.addEventListener('keydown',keyListener)
        },
        destroyed(){
            document.removeEventListener('keydown',keyListener)
        },
        props:{

        },
        data() {
            return {
                progress1: 0,
                progress2: 0,
                mousePressed: false,
                lastHandlingMovingTime: 0,
                handlingMovingInterval: 10,
                curGear:0
            }
        },
        computed: {
            clutchLevel() {
                return this.progress1 / 100
            },
            accelerationLevel() {
                return this.progress2 / 100
            }
        },
        methods: {
            onmousedown(e) {
                this.mousePressed = true

                let pos = getOffset(this.$refs.touchPanel)
                this.progress1 = pos.x * 100
                this.progress2 = pos.y * 100
                this.$refs.ball.style.left = pos.x * 100 + '%'
                this.$refs.ball.style.top = pos.y * 100 + '%'

            },
            onmousemove(e) {
                if (!this.mousePressed) return
                let now = Date.now()
                if (now - this.lastHandlingMovingTime < this.handlingMovingInterval) return
                let pos = getOffset(this.$refs.touchPanel)
                this.progress1 = pos.x * 100
                this.progress2 = pos.y * 100
                this.$refs.ball.style.left = pos.x * 100 + '%'
                this.$refs.ball.style.top = pos.y * 100 + '%'
                this.lastHandlingMovingTime = now

            },
            onmouseup(e) {
                this.mousePressed = false
            },
            onkeydown(e){
                if (e.key==='Enter')
                this.$emit('startUp')
            },
            test(value){
                this.$emit('switch',value)
                console.log('switch',value)

            }
        },
        watch:{
            clutchLevel(value){
                this.$emit('clutch',value)
            },
            accelerationLevel(value){
                this.$emit('acceleration',value)
            }
        }
    }
</script>

<style scoped>
    .touch-panel {
        width: 300px;
        height: 300px;
        position: relative;
        background-color: rgba(50, 50, 50, .5);

    }

    .touch-panel__ball {
        width: 0px;
        height: 0px;
        position: absolute;
        left: 0%;
        top: 0%;
    }

    .touch-panel__ball:after {
        content: '';
        width: 20px;
        height: 20px;
        background-color: #bc3500;
        display: inline-block;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }
</style>
