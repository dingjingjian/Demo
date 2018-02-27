<template>
  <div>
    <h2>结果</h2>
    <el-card class="box-card">
      <p>您一共回答了{{total}}题，回答正确{{result.correct}}题，回答错误{{result.wrong}}题，总用时{{result.time}}秒</p>
      <div>
        <el-progress class="box-svg" type="circle" :percentage="correct" status="success"></el-progress>
        <el-progress class="box-svg" type="circle" :percentage="wrong" status="exception"></el-progress>
      </div>
      <el-alert class="alert"
        :title="info"
        type="info"
        show-icon>
      </el-alert>
      <el-button round @click="goBack()">返 回</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ResultPage',
  data () {
    return {
      correct: 0,
      wrong: 0,
      info: '',
      tipsArr: ['你说，是不是把知识都还给小学老师了？', '还不错，但还需要继续加油哦！', '不要嘚瑟还有进步的空间！', '智商离爆表只差一步了！', '你也太聪明啦，无敌是多么的寂寞！']
    }
  },
  computed: {
    // 获取答题结果数据
    total: function () {
      return this.$store.state.questions.length
    },
    result: function () {
      return this.$store.state.result
    }
  },
  methods: {
    // 根据答题结果获取评价
    getTip: function () {
      if (this.correct <= 20) {
        this.info = this.tipsArr[0]
        return
      }
      if (this.correct <= 40) {
        this.info = this.tipsArr[1]
        return
      }
      if (this.correct <= 60) {
        this.info = this.tipsArr[2]
        return
      }
      if (this.correct <= 80) {
        this.info = this.tipsArr[3]
        return
      }
      if (this.correct <= 100) {
        this.info = this.tipsArr[4]
      }
    },
    // 返回主页
    goBack: function () {
      this.$router.push('/')
    }
  },
  created () {
    // 如果刷新页面跳转回主页
    if (this.$store.state.result.correct === 0 && this.$store.state.result.wrong === 0) {
      this.goBack()
    }
    // 计算回答正确占比
    this.correct = this.$store.state.result.correct / this.$store.state.questions.length * 100
    // 计算回答错误占比
    this.wrong = this.$store.state.result.wrong / this.$store.state.questions.length * 100
    // 显示提示信息
    this.getTip()
  }
}
</script>

<style scoped>
.box-card{
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
}
.box-svg{
  margin: 0 5px;
}
.progress{
  width: 50%;
}
.alert{
  margin: 10px 0;
}
</style>
