<template>
  <el-menu
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    mode="horizontal"
    @select="">
    <el-menu-item index="1">
      <router-link :to="{name:'index'}" class="catagory__item">首页</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link :to="{name:'demo'}" class="catagory__item">Demo</router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link :to="{name:'about'}" class="catagory__item">关于我</router-link>
    </el-menu-item>
  </el-menu>
</template>
<script>
  export default {
    components: {},
    data() {
      return {}
    },
    props: {},
    computed: {},
    watch: {}
  }
</script>
<style>
  .catagory__item {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
</style>
