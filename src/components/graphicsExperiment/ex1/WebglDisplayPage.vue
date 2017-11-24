<template>
  <div>
    <el-card class="box-card" style="max-width: 500px;margin: auto">
      <div slot="header" class="clearfix">
        <span>Hello   Webgl</span>
      </div>
      <canvas ref="canvas" width="640" height="480"></canvas>
      <p>当前帧绘制使用了{{timeResume}}ms</p>
      <canvas-control @reset="controlResetHandler"></canvas-control>
    </el-card>
  </div>
</template>
<script>
  import CanvasControl from './CanvasControl.vue'

  export default {

    mounted() {

//            异步加载绘图相关模块
      this.$nextTick(function () {
        setTimeout(() => {
          require.ensure(['./canvasManager', 'three'], () => {
            this.canvasManager = require('./canvasManager').canvasManager;
            this.canvasManager.mount(this.$refs.canvas);
            this.canvasManager.on('rerender', (time) => {
              this.timeResume = time
            })
          })
        }, 0)

      })
    },
    methods: {
      controlResetHandler(bundle) {
        if (this.canvasManager)
          this.canvasManager.reset(bundle)
      }
    },
    watch: {
    },
    computed: {},
    data() {
      return {
//                canvasManager为绘图相关对象  require是异步的所sdaf以在这里预留
        canvasManager: null,
//                当前帧绘制所用时间
        timeResume: 0,
//                控制相关变量
        controlStats: {
          autoRotate: true
        }
      }
    },
    props: {
    },
    components: {
      CanvasControl
    }
  }
</script>
<style scoped>
  h1 {
    text-align: center;
  }


  .canvas-area {
    width: 720px;
  }

  .canvas-area-wrapper {
    margin-top: 3em;
    justify-content: center;
  }

  canvas {
    width: 100%;
    border: 1px solid gray;
  }
</style>
