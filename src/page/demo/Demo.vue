<template>
  <div>
    <h1>Demo</h1>
    <el-tabs v-model="activeRouteName" @tab-click="">
      <el-tab-pane
        v-for="experiment in experimentList"
        :key="experiment.routePath"
        :label="experiment.experimentTitle"
        :name="experiment.routeName"
      />
    </el-tabs>
    <router-view/>
  </div>
</template>
<script>
  import graphicsExperimentInfo from '../../components/graphicsExperiment'

  export default {
    components: {},
    data() {
      return {
        activeRouteName: ''
      }
    },
    props: {},
    computed: {
//      所有的实验列表
      experimentList: () => graphicsExperimentInfo
    },
    watch: {
      activeRouteName(routeName) {
        if (this.experimentList.some(item => item.routeName === routeName)) {
//        路由
          this.$router.replace({name: routeName})
        }else {
//        未匹配到路由  定向到默认路由
          this.$router.replace({name: 'demo'})
        }
      }
    }
  }

  function match() {

  }
</script>
<style>

</style>
