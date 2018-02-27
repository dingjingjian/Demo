<template>
  <div>
      <h1>欢迎</h1>
      <el-button type="primary" icon="el-icon-edit" @click="Goquestion">我要答题</el-button>
      <el-button type="success" icon="el-icon-edit-outline" @click="visible = true">我要出题</el-button>
      <el-dialog :visible.sync="visible" title="提示">
        <p>暂未开启</p>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return { visible: false }
  },
  methods: {
    // 页面跳转
    Goquestion: function () {
      this.$router.push('/question')
    }
  }
}
</script>

<style>

</style>
