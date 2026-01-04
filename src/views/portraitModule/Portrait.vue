<template>
  <div class="assessment-container">
    <div class="main-layout">
      <div class="chart-card pie-section">
        <h2 class="pie-title" style="color: rgb(0, 153, 67);font-size: 15px;">个人技能概况图</h2>
        <div ref="pieChartRef" class="full-chart">
        </div>
      </div>

      <div class="chart-card matrix-section">
        <div class="matrix-header">
          <h2 class="matrix-title" style="color: rgb(0, 153, 67);">技能矩阵图</h2>
          <el-select v-model="year" @change="updateAllCharts" size="small" style="width: 100px;">
            <el-option label="2025年" value="2025"></el-option>
            <el-option label="2024年" value="2024"></el-option>
          </el-select>
        </div>

        <div class="matrix-legend">
          <div v-for="(color, label) in colorMap" :key="label" class="legend-item">
            <i :style="{ backgroundColor: color }"></i><span>{{ label }}</span>
          </div>
        </div>

        <div class="matrix-grid">
          <div v-for="(group, index) in currentData" :key="index" class="matrix-group">
            <div class="group-header">
              <span class="group-dot"></span>
              <span class="group-label">{{ group.name }}</span>
            </div>
            <div class="chart-wrapper">
              <div :ref="el => { if (el) matrixRefs[index] = el }" class="group-chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chart-card line-compare-section">
      <div class="line-header">
        <span class="matrix-title" style="color: rgb(0, 153, 67);">个人成绩对比</span>
        <div class="year-select-group">
          <el-select  v-model="compareYear1" size="small" style="width: 100px; margin-right: 10px;"
            @change="updateLineChartByYear" placeholder="选择年份">
            <el-option v-for="(value,year1,index) in yearDataMap" :key="index" :label="year1 + '年'" :value="year1"></el-option>
          </el-select>
          <el-select v-model="compareYear2" size="small" style="width: 100px;" @change="updateLineChartByYear"
            placeholder="选择年份">
            <el-option v-for="(value,year2,index) in yearDataMap" :key="index" :label="year2 + '年'" :value="year2"></el-option>
          </el-select>
        </div>
      </div>
      <div ref="lineChartRef" class="full-chart"></div>
    </div>
    <span class="table-title" style="color: rgb(0, 153, 67);margin-left: 20px;">个人培训计划</span>
    <div class="training-plan" style="display: flex;align-items: center; width: 100%;background: #fff;">
      <div>
        <el-card class="box-card"style="box-shadow: none !important;border: none !important;">
          <div class="text item1" style="background-color: rgb(235, 250, 245);width: 150px;height: 35px; text-align: center;line-height: 35px;display: flex;align-items: center;">
            <DocumentChecked style="margin-left: 10px; width: 25px;color: rgb(102, 206, 175);"></DocumentChecked>通过{{planCount.通过}}项
          </div>
          <div class="text item2"
            style="background-color: rgb(245, 243, 252);width: 150px;text-align: center;margin-top: 20px;height: 35px;line-height: 35px;display: flex;align-items: center;">
            <DocumentChecked style="margin-left: 10px; width: 25px;color: rgb(255, 1, 5);"></DocumentChecked>不合格{{planCount.不合格}}项
          </div>
          <div class="text item3"
            style="background-color: rgb(254, 249, 243);width: 150px;text-align: center;margin-top: 20px;height: 35px;line-height: 35px;display: flex;align-items: center;">
            <Timer style="margin-left: 10px; width: 25px;color: rgb(255, 198, 115);"></Timer>待测评{{planCount.待测评}}项
          </div>
        </el-card>
      </div>
      <div style="display:flex; margin-left: 15px;">
        <div>
          <div style="display: flex; align-items: center;">
            <DocumentChecked style="margin-left: 10px; width: 25px;color: rgb(102, 206, 175);"></DocumentChecked>
            <span>已完成测评情况</span>
          </div>
          
          <el-table :data="Finished" height="250" border style="width: 600px">
            <el-table-column label="序号" width="80px" align="center" type="index"> </el-table-column>
            <el-table-column prop="item" label="测评项目" width="250" align="center"> </el-table-column>
            <el-table-column prop="score" label="分数" align="center"> </el-table-column>
            <el-table-column prop="result" label="结果" align="center"> </el-table-column>
          </el-table>
        </div>
        <div>
            <div style="display: flex; align-items: center;">
            <Timer style="margin-left: 35px; width: 25px;color: rgb(255, 198, 115);"></Timer>
            <span>待完成测评</span>
            </div>
            <el-table :data="UnFinished" height="250" border style="width: 500px; margin-left:25px;">
            <el-table-column label="序号" width="80px" align="center" type="index"> </el-table-column>
            <el-table-column prop="item" label="测评项目" width="250" align="center"> </el-table-column>
            <el-table-column prop="end_time" label="截至日期" align="center" width="180px"> </el-table-column>
          </el-table></div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Check, DocumentChecked, Timer } from '@element-plus/icons-vue'

/************************ 【一、个人技能概况图 + 技能矩阵图 专属数据区 ✅ 全部抽离到这里】 ************************/
// 等级-颜色映射 (饼图+矩阵图共用)
const colorMap = {
  '优秀': '#72c4ff',
  '良好': '#70db70',
  '合格': '#ffcc66',
  '不合格': '#ff8585'
}
// 技能矩阵图+饼图核心数据源 (年份维度)
const rawDataMap: any = {
  '2025': [
    {
      name: '车控室设备操作',
      children: [
        { name: 'HMI/ATS信号系统', value: 1, score: 96, level: '良好' },
        { name: 'IBP/MCP控制盘', value: 1, score: 98, level: '良好' },
        { name: 'ISCS综合监控', value: 1, score: 85, level: '良好' },
        { name: 'EST3/FC726工作站', value: 1, score: 100, level: '优秀' },
        { name: 'CCTV/门禁/广播', value: 1, score: 100, level: '优秀' },
        { name: '可视化接地装置', value: 1, score: 98, level: '良好' }
      ]
    },
    {
      name: '客运设备操作',
      children: [
        { name: '站台门', value: 1, score: 85, level: '不合格' },
        { name: '票务设备', value: 1, score: 71, level: '不合格' },
        { name: '消防设施(PPE)', value: 1, score: 79, level: '不合格' },
        { name: '消防设施(PPE)', value: 1, score: 79, level: '不合格' },
        { name: '消防设施(PPE)', value: 1, score: 79, level: '不合格' },
        { name: '消防设施(PPE)', value: 1, score: 79, level: '不合格' },
        { name: '消防设施(PPE)', value: 1, score: 79, level: '不合格' },
        { name: '电扶梯', value: 1, score: 70, level: '不合格' },
        { name: '设备断电', value: 1, score: 78, level: '不合格' }
      ]
    },
    {
      name: '车站应用系统操作',
      children: [
        { name: 'EAM/安全/防汛系统', value: 1, score: 88, level: '合格' },
        { name: '施工管理系统', value: 1, score: 86, level: '合格' },
        { name: '施工管理系统', value: 1, score: 86, level: '合格' },
        { name: '施工管理系统', value: 1, score: 86, level: '合格' },
        { name: '施工管理系统', value: 1, score: 86, level: '合格' },
        { name: 'SC操作系统', value: 1, score: 89, level: '合格' },
        { name: 'BOM操作系统', value: 1, score: 97, level: '良好' }
      ]
    },
    {
      name: '突发应急处置',
      children: [
        { name: '人工准备进路', value: 1, score: 89, level: '合格' },
        { name: '信号系统故障', value: 1, score: 78, level: '不合格' },
        { name: '站台门故障', value: 1, score: 95, level: '良好' },
        { name: '站台门故障', value: 1, score: 95, level: '良好' },
        { name: '站台门故障', value: 1, score: 95, level: '良好' },
        { name: '站台门故障', value: 1, score: 95, level: '良好' },
        { name: '站台门故障', value: 1, score: 95, level: '良好' },
        { name: '站台门故障', value: 1, score: 95, level: '良好' },
        { name: '客伤处置', value: 1, score: 91, level: '良好' }
      ]
    }
  ],
  '2024': [ ]
}
/************************ 【二、折线图 专属数据区】 ************************/
const yearDataMap = {
  '2024': [85, 95, 80, 88, 80, 75, 95, 85, 90, 95, 75, 78, 85, 92, 88, 92, 80, 68, 75, 100, 99, 99, 99],
  '2025': [92, 100, 85, 100, 60, 82, 95, 86, 89, 97, 85, 71, 70, 78, 85, 95, 80, 86, 91, 88, 99, 99, 99],
  '2026': [98, 80, 95, 100, 90, 82, 90, 86, 99, 87, 85, 91, 90, 88, 85, 95, 89, 86, 97, 88, 100, 99, 99],
  '2023': [78, 90, 75, 85, 78, 70, 90, 80, 88, 92, 70, 75, 80, 90, 85, 88, 75, 65, 70, 95, 95, 95, 95]
}
// const yearColorMap = {
//   '2024': '#ff4d4f', // 左侧红框 对应折线【红色】
//   '2025': '#009688', // 右侧绿框 对应折线【绿色】
//   '2023': '#ff7300',
//   '2026': '#9966cc'
// }
const LEFT_SELECT_COLOR = '#ff4d4f' // 左框红色
const RIGHT_SELECT_COLOR = '#009688' // 右框绿色

const lineCategories = [
  'HMI/ATS信号系统', 'IBP/MCP控制盘', 'ISCS综合监控', 'EST3/FC726工作站',
  '可视化接地装置', 'CCTV/门禁/广播', 'EAM/气象/安全系统', '施工管理系统',
  'SC操作系统', 'BOM操作系统', '站台门', '票务设备', '电扶梯', '设备断电',
  '人工准备进路', '信号系统故障', '站台门故障', '火灾应急处置', '水淹应急处置', '客伤处置', '1', '2', '3'
]
/************************ 【三、培训计划表 专属数据区】 ************************/
const tableData = ref([
  { item: "HMI/ATS信号系统", score: 96, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "IBP/MCP控制盘", score: 92, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "ISCS综合监控", score: 68, result: "不合格", start_time: "2025-12-03", end_time: "2025-12-31" },
  { item: "EST3/FC726工作站", score: 0, result: "待测评", start_time: "2025-12-08", end_time: "2026-01-15" },
  { item: "可视化接地装置", score: 94, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "CCTV/门禁/广播", score: 89, result: "通过", start_time: "2025-12-02", end_time: "2026-01-10" },
  { item: "EAM/气象/安全系统", score: 0, result: "待测评", start_time: "2025-12-10", end_time: "2026-01-20" },
  { item: "施工管理系统", score: 90, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "SC操作系统", score: 87, result: "通过", start_time: "2025-12-05", end_time: "2026-01-05" },
  { item: "BOM操作系统", score: 93, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "站台门", score: 76, result: "通过", start_time: "2025-12-04", end_time: "2025-12-31" },
  { item: "票务设备", score: 85, result: "通过", start_time: "2025-12-01", end_time: "2026-01-08" },
  { item: "电扶梯", score: 65, result: "不合格", start_time: "2025-12-06", end_time: "2025-12-31" },
  { item: "设备断电", score: 0, result: "待测评", start_time: "2025-12-12", end_time: "2026-01-25" },
  { item: "人工准备进路", score: 97, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "信号系统故障", score: 88, result: "通过", start_time: "2025-12-03", end_time: "2026-01-12" },
  { item: "站台门故障", score: 91, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" },
  { item: "火灾应急处置", score: 95, result: "通过", start_time: "2025-12-02", end_time: "2025-12-31" },
  { item: "水淹应急处置", score: 0, result: "待测评", start_time: "2025-12-15", end_time: "2026-01-30" },
  { item: "客伤处置", score: 86, result: "通过", start_time: "2025-12-01", end_time: "2025-12-31" }
]);
/************************ 【四、响应式变量 & 业务逻辑】 ************************/
const year = ref('2025')
const pieChartRef = ref<HTMLElement | null>(null)
const lineChartRef = ref<HTMLElement | null>(null)
const matrixRefs = ref<any[]>([])
let pieInstance: echarts.ECharts | null = null
let lineInstance: echarts.ECharts | null = null
let matrixInstances: echarts.ECharts[] = []

const currentYear = ref<number>(new Date().getFullYear())
const compareYear1 = ref<number>(currentYear.value-1)
const compareYear2 = ref<number>(currentYear.value)

// 培训计划统计
const planCount:Record<string,number> = {'通过':0,'不合格':0,'待测评':0}
tableData.value.forEach(item =>{
  if(item.result === '通过'){
    planCount.通过 +=1
  }else if(item.result === '不合格'){
    planCount.不合格 +=1
  }else{
    planCount.待测评 +=1
  }
})
const Finished = computed(()=> {
  return tableData.value.filter(item => item.result === '通过' || item.result ==='不合格')
})
const UnFinished = computed(()=>{
  return tableData.value.filter(item =>item.result === '待测评')
})
const currentData = computed(() => rawDataMap[year.value] || [])

/************************ 【五、图表初始化 & 更新方法】 ************************/
const initPie = () => {
  if (!pieChartRef.value) return
  pieInstance = echarts.init(pieChartRef.value)
  const levelCount: Record<string, number> = { '优秀': 0, '良好': 0, '合格': 0, '不合格': 0 }
  currentData.value.forEach(group => {
    group.children.forEach((item: any) => {
      const level = item.level || '合格'
      levelCount[level] += 1
    })
  })
  pieInstance.setOption({
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '50%'],
      data: Object.entries(levelCount).map(([name, value]) => ({
        name, value, itemStyle: { color: colorMap[name as keyof typeof colorMap] }
      })),
      label: { show: false }, labelLine: { show: false },
      emphasis: { disabled: true }, tooltip: { show: false }
    }]
  })
}

const initLineChart = () => {
  if (!lineChartRef.value) return
  lineInstance = echarts.init(lineChartRef.value)

  const showScroll = lineCategories.length > 20;
  const seriesData = [
  {
    name: `${compareYear1.value}年`,
    type: 'line' as const,
    data: yearDataMap[compareYear1.value as keyof typeof yearDataMap] || [],
    smooth: true,
    itemStyle: { color: LEFT_SELECT_COLOR }, // 左侧选择框→永久红色折线
    symbolSize: 5,
    lineStyle: { width: 2 }
  },
  {
    name: `${compareYear2.value}年`,
    type: 'line' as const,
    data: yearDataMap[compareYear2.value as keyof typeof yearDataMap] || [],
    smooth: true,
    itemStyle: { color: RIGHT_SELECT_COLOR }, // 右侧选择框→永久绿色折线
    symbolSize: 6,
    lineStyle: { width: 2 }
  }
]

  const option: any = {
    tooltip: { trigger: 'axis', confine: true },
    legend: { show: false },
    grid: {
      left: '3%',
      right: '2%',
      top: '10%',
      bottom: showScroll ? '45px' : '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: lineCategories,
      axisLine: { lineStyle: { color: '#e5e5e5' } },
      axisTick: { alignWithLabel: true, length: 2 },
      axisLabel: {
        interval: 0,
        fontSize: 9,
        color: '#666',
        margin: 4,
        lineHeight: 10,
        formatter: (value: string) => {
          let ret = "";
          let maxLength = 5;
          let rowNum = Math.ceil(value.length / maxLength);
          if (rowNum > 1) {
            for (let i = 0; i < rowNum; i++) {
              ret += value.substring(i * maxLength, (i + 1) * maxLength) + "\n";
            }
            return ret.trim();
          } else {
            return value;
          }
        }
      }
    },
    yAxis: {
      type: 'value',
      max: 100,
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f5f5f5' } },
      axisLabel: { formatter: '{value}分', fontSize: 10, margin: 6 }
    },
    series: seriesData
  }

  if (showScroll) {
    option.dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        startValue: 0,
        endValue: 19,
        height: 10,
        bottom: 8,
        handleSize: '60%',
        showDetail: false,
        borderColor: 'transparent',
        backgroundColor: '#f0f0f0'
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        startValue: 0,
        endValue: 19
      }
    ]
  }

  lineInstance.setOption(option)
}

const updateLineChartByYear = () => {
  if (!lineInstance) return
  initLineChart()
}

const updateAllCharts = async () => {
  await nextTick()
  initPie()
  initLineChart()

  matrixInstances.forEach(ins => ins.dispose())
  matrixInstances = []

  currentData.value.forEach((group: any, index: number) => {
    const el = matrixRefs.value[index]
    if (!el) return
    const ins = echarts.init(el)
    ins.setOption({
      grid: { top: 0, left: 0, right: 0, bottom: 0 },
      series: [{
        type: 'treemap', left: 0, top: 0, right: 0, bottom: 0,
        width: '100%', height: '100%',
        roam: false, nodeClick: false, breadcrumb: { show: false },
        label: {
          show: true, position: 'inside', formatter: '{b}\n{c}分',
          fontSize: 9, color: '#fff', overflow: 'breakAll', lineHeight: 11
        },
        itemStyle: { borderColor: '#fff', borderWidth: 1, gapWidth: 1 },
        data: group.children.map((child: any) => ({
          name: child.name, value: child.score,
          itemStyle: { color: colorMap[child.level as keyof typeof colorMap] || '#ccc' }
        }))
      }]
    })
    matrixInstances.push(ins)
  })
}

onMounted(() => {
  updateAllCharts()
  window.addEventListener('resize', () => {
    pieInstance?.resize(); lineInstance?.resize();
    matrixInstances.forEach(ins => ins.resize());
  })
})
</script>

<style scoped>
.assessment-container {
  background-color: #f5f7f9;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
	padding-bottom: 30px;
}

.main-layout {
  display: flex;
  gap: 12px;
  height: 480px;
  flex-shrink: 0;
}

.chart-card {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.pie-section {
  width: 320px;
}
.pie-title {
  font-size: 15px;
  font-weight: bold;
  margin: 0;
  border-left: 4px solid #009688;
  padding-left: 12px;
  position: relative;
}
.pie-title::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: rgb(253, 209, 8);
}

.full-chart {
  flex: 1;
  width: 100%;
  height: 100%;
}

.matrix-section {
  flex: 1;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.matrix-title {
  font-size: 15px;
  font-weight: bold;
  margin: 0;
  border-left: 4px solid #009688;
  padding-left: 12px;
  position: relative;
}
.matrix-title::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: rgb(253, 209, 8);
}

.matrix-legend {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 11px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.legend-item i {
  width: 8px;
  height: 8px;
  border-radius: 1px;
}

.matrix-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  overflow: hidden;
}

.matrix-group {
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 4px;
  background: #fafafa;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.group-dot {
  width: 5px;
  height: 5px;
  background: #009688;
  border-radius: 50%;
}

.group-label {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.chart-wrapper {
  flex: 1;
  width: 100%;
  position: relative;
}

.group-chart {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.line-compare-section {
  margin-top: 15px;
  height: 380px;
  flex-shrink: 0;
  padding: 8px 12px !important;
}

.line-header {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.year-select-group {
  display: flex;
  align-items: center;
}


:deep(.el-select .el-input__wrapper) {
  padding: 0 8px;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
}
:deep(.el-select .el-input__inner) {
  text-align: center;
  font-size: 12px;
}
:deep(.ec-dataZoom-slider) {
  border-radius: 0 !important;
}
:deep(.ec-dataZoom-slider-handle) {
  border-radius: 3px !important;
}

.table-title {
  font-size: 15px;
  font-weight: bold;
  margin: 0;
  border-left: 4px solid #009688;
  padding-left: 12px;
  position: relative;
  margin-top: 15px;
  display: block;
}
.table-title::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: rgb(253, 209, 8);
}
</style>