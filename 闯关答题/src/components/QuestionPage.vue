<template>
  <div>
    <h2>第 {{count}} 题</h2>
    <div>剩余时间：{{limitTime}}s</div>
    <div class="container">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" :status="status" class="progress"></el-progress>
      <el-card class="box-card">
        <p>{{question.describe}}</p>
        <el-row v-for="(value, index) in question.options" :key="value.id">
          <el-col :span="24">
            <el-button type="primary" class="option" :class="{'choosed':choosedId==index&&!value.correct,'correct':choosedId!=null&&value.correct,}" @click="answer(value)" :disabled="choosedId!=null">{{ value.option }}
              <i class="el-icon--right" v-show="choosedId==index" :class="{'el-icon-success':value.correct,'el-icon-error':!value.correct}" ></i>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <div v-show="choosedId!=null" class="alert">
        <el-alert v-if="correct"
          title="回答正确"
          type="success"
          description="666,你很强"
          show-icon>
        </el-alert>
        <el-alert v-if="!correct&&choosedId!=-1"
          title="回答错误"
          type="error"
          description="好可惜，下次努力"
          show-icon>
        </el-alert>
        <el-alert v-if="choosedId===-1"
          title="回答超时"
          type="error"
          description="时间就是金钱，我的朋友"
          show-icon>
        </el-alert>
        <el-button class="button" round v-if="!lastQuestion" @click="next()">下一题</el-button>
        <el-button class="button" type="success" round v-if="lastQuestion" @click="result()">完  成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionPage',
  data () {
    return {
      count: 1,
      choosedId: null,
      correct: false,
      lastQuestion: false,
      percentage: 0,
      status: '',
      limitTime: 10 // 限时，单位：秒
    }
  },
  computed: {
    // 获取题目信息
    question: function () {
      return this.$store.state.questions[this.count - 1]
    }
  },
  methods: {
    answer: function (answer) {
      this.choosedId = answer.id
      // 判断选择的答案是否正确
      if (answer.correct) {
        this.correct = true
        this.$store.commit('correct')
      } else {
        this.correct = false
        this.$store.commit('wrong')
      }
      // 判断是否为最后一题
      if (this.count === this.$store.state.questions.length) {
        this.lastQuestion = true
      }
      // 计算答题进度
      this.percentage = parseInt(this.count / this.$store.state.questions.length * 100)
      if (this.percentage === 100) {
        this.status = 'success'
      }
    },
    next: function () {
      this.count += 1
      this.choosedId = null
      this.correct = false
      this.limitTime = 10
      this.timer()
    },
    result: function () {
      this.$router.push('/result')
    },
    // 计时器
    timer: function () {
      let limitTime = this.limitTime
      let t = setInterval(() => {
        if (this.limitTime > 0 && this.choosedId == null) {
          this.limitTime--
        } else if (this.limitTime === 0 && this.choosedId == null) {
          clearInterval(t)
          // 判断是否为最后一题
          if (this.count === this.$store.state.questions.length) {
            this.lastQuestion = true
          }
          this.choosedId = -1
          this.$store.commit('wrong')
          this.$store.commit('time', limitTime)
        } else {
          clearInterval(t)
          this.$store.commit('time', limitTime - this.limitTime)
        }
      }, 1000)
    }
  },
  created () {
    // 初始化答题结果数据
    this.$store.state.result.correct = 0
    this.$store.state.result.wrong = 0
    this.$store.state.result.time = 0
    this.timer()
  }
}
</script>

<style scoped>
.container{
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
}
.container .progress{
  margin: 10px 0;
}
.container .option{
  margin: 10px 0;
  width: 90%;
}
.container .button{
  margin: 10px 0;
}
.container .alert{
  margin: 10px 0;
}
.choosed,.choosed:hover{
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.correct,.correct:hover{
  background-color: #67c23a;
  border-color: #67c23a;
}
</style>
