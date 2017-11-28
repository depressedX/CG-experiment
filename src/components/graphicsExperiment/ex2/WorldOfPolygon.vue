<template>
  <div>
    <div style="text-align: center">
      <canvas ref="targetCanvas"/>
    </div>
    <div>
      <el-button type="primary" @click="createNewShape">创建新的多边形</el-button>
    </div>
  </div>
</template>
<script>
  import WorldOfPolygon from './worldOfPolygon'

  export default {
    components: {},
    mounted() {
      this.world = new WorldOfPolygon({targetCanvas: this.$refs.targetCanvas})
    },
    data() {
      return {
        world:null
      }
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      createNewShape(){
        if (this.world){
          this.world.createNewShape()
        }
      }
    }
  }
</script>
<style>

</style>
