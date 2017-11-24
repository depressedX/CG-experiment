<template>
  <el-container>
    <el-header>
      <the-header/>
    </el-header>
    <el-aside>
      <the-aside/>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
    <el-footer>
      <the-footer/>
    </el-footer>
  </el-container>
</template>
<script>
  import TheFooter from './components/footer/TheFooter.vue'
  import TheHeader from './components/header/TheHeader.vue'
  import TheAside from './components/aside/TheAside.vue'

  export default {
    components: {
      TheFooter, TheHeader, TheAside
    },
    data() {
      return {}
    },
    props: {},
    computed: {},
    watch: {}
  }
</script>
<style>

</style>
