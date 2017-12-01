<template>
  <div>
    <div>
      <div class="block">
        <span class="demonstration">多边形颜色状态机</span>
        <el-color-picker v-model="colorState" color-format="hex"/>
      </div>
      <el-button type="primary" @click="test">显示</el-button>
      <el-button type="primary" @click="downloadSavedPolygon">存储</el-button>
      <div>
        <span>切换状态</span>
        <el-radio-group v-model="state">
          <el-radio-button :label="consts.DISPLAY">展示多边形</el-radio-button>
          <el-radio-button :label="consts.CREATE">创建新的多边形</el-radio-button>
          <el-radio-button :label="consts.EDIT">编辑</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div style="text-align: center">
      <canvas ref="targetCanvas"/>
    </div>
  </div>
</template>
<script>
  import WorldOfPolygon from './worldOfPolygon'
  import consts from './consts'

  export default {
    components: {},
    mounted() {
      this.world = new WorldOfPolygon({targetCanvas: this.$refs.targetCanvas})
    },
    data() {
      return {
        world: null,
        colorState: null,
        state: consts.DISPLAY,
        consts

      }
    },
    props: {},
    computed: {},
    watch: {
      colorState(value) {
        let hexValue = value.substring(1)
        this.world.setColor(parseInt(hexValue.slice(0, 2), 16), parseInt(hexValue.slice(2, 4), 16), parseInt(hexValue.slice(4, 6), 16))
      },
      state(value) {
        if (!this.world) return
        switch (value) {
          case consts.DISPLAY:
            this.world.display()
            break;
          case consts.CREATE:
            this.world.createNewShape()
            break;
          case consts.EDIT:
            this.world.edit()
            break;
        }
      }
    },
    methods: {
      downloadSavedPolygon() {
        this.world.downloadSavedPolygon()
      },
      test() {
        console.log(JSON.stringify(this.world.serializeSavedPolygon()))
      }
    }
  }
</script>
<style>

</style>
