import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    questions: [
      {
        id: 0,
        describe: '下列选项中不属于前端技术的是：',
        options: [{id: 0, option: 'Vue'}, {id: 1, option: 'CSS'}, {id: 2, option: 'HTML'}, {id: 3, option: 'JAVA', correct: true}]
      },
      {
        id: 1,
        describe: '下列选项中属于武汉特色小吃的是：',
        options: [{id: 0, option: '热干面', correct: true}, {id: 1, option: '广东烧鹅'}, {id: 2, option: '北京烤鸭'}, {id: 3, option: '兰州拉面'}]
      },
      {
        id: 1,
        describe: '下列城市不属于“三大火炉”的是：',
        options: [{id: 0, option: '武汉'}, {id: 1, option: '重庆'}, {id: 2, option: '成都', correct: true}, {id: 3, option: '南京'}]
      },
      {
        id: 1,
        describe: '三十六计第三十六计是：',
        options: [{id: 0, option: '空城计'}, {id: 1, option: '美人计'}, {id: 2, option: '连环计'}, {id: 3, option: '走为上计', correct: true}]
      },
      {
        id: 1,
        describe: '毛瑟98K狙击步枪使用的是多少口径的子弹：',
        options: [{id: 0, option: '7.62mm'}, {id: 1, option: '7.92mm', correct: true}, {id: 2, option: '5.56mm'}, {id: 3, option: '5.8mm'}]
      }
    ],
    result: {
      correct: 0,
      wrong: 0,
      time: 0
    }
  },
  mutations: {
    correct (state) {
      state.result.correct++
    },
    wrong (state) {
      state.result.wrong++
    },
    time (state, t) {
      state.result.time += t
    }
  }
})

export default store
