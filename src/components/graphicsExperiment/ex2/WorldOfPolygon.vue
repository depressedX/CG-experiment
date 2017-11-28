<template>
  <div style="text-align: center">
    <canvas ref="targetCanvas"/>
  </div>
</template>
<script>
  import WordOfPolygon from './wordOfPolygon'
  export default {
    components: {},
    mounted() {
      new WordOfPolygon({targetCanvas:this.$refs.targetCanvas})
    },
    data() {
      return {}
    },
    props: {},
    computed: {},
    watch: {},
    methods: {}
  }
</script>
<style>

</style>
