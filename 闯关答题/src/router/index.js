import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import QuestionPage from '@/components/QuestionPage'
import ResultPage from '@/components/ResultPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/question',
      name: 'QuestionPage',
      component: QuestionPage
    },
    {
      path: '/result',
      name: 'ResultPage',
      component: ResultPage
    }
  ]
})
