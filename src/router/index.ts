import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import { createRouter, createWebHistory } from 'vue-router'


const Portrait = () => import('@/views/portraitModule/Portrait.vue'); // 画像模块
    const ScoreDetails = () => import('@/views/portraitModule/subOption/ScoreDetails.vue');  //画像模块-成绩详情
const Plan = () => import('@/views/planModule/Plan.vue');         // 计划模块
const Analysis = () => import('@/views/analysisModule/Analysis.vue'); // 分析模块
const HumanFactor = () => import('@/views/humanFactorModule/HumanFactor.vue'); // 人因模块

const Report = () => import('@/views/reportModule/Report.vue');     // 报表模块

const ErrorCollection = () => import('@/views/errorModule/ErrorCollection.vue');     // 错题集模块

const routes = [    
      // 模块路由
      { path: '/portrait', component: Portrait, name: 'Portrait'},
      {path:'/score-details',component:ScoreDetails,name:'ScoreDetails'},
      { path: '/plan', component: Plan, name: 'Plan' },
      { path: '/analysis', component: Analysis, name: 'Analysis' },
      { path: '/human-factor', component: HumanFactor, name: 'HumanFactor' },
      { path: '/report', component: Report, name: 'Report' },
      {path: '/error-collection', component: ErrorCollection, name: 'ErrorCollection'},
      // 默认跳转到画像模块
      { path: '', redirect: 'portrait' }
    ]
  


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
