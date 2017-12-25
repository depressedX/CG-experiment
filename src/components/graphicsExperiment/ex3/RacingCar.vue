<template>
    <div>
        <h1>RacingCarTitle</h1>
        <canvas ref="targetCanvas"/>
    </div>
</template>

<script>
    import {init as rendererInit} from './renderer'
    export default {
        name: "racing-car",
        components:{

        },
        mounted(){
            rendererInit({canvas:this.$refs.targetCanvas})
        }
    }
</script>

<style scoped>

</style>
