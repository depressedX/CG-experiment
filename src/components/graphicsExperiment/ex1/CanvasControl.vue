<template>
  <el-form>
    <h1>CanvasControl</h1>
    <el-form-item label="自动旋转">
      <el-switch
        v-model="autoRotate"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="$emit('reset',{autoRotate})"/>
    </el-form-item>
    <el-form-item label="只绘制边框">
      <el-switch
        v-model="wireframe"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="$emit('reset',{wireframe})"/>
    </el-form-item>
    <el-form-item label="绘制精度">
      <el-input v-model="spec"/>
    </el-form-item>
    <el-button @click="$emit('reset',{spec:parseInt(spec)})">更改精度</el-button>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        autoRotate: false,
        wireframe: true,
        spec: 10
      }
    },
    methods: {
      hello() {
        console.log('hello')
      }
    },
    props: {}
  }
</script>
