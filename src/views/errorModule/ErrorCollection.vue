<template>
  <div class="body">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的错题集" name="first"></el-tab-pane>
        <el-tab-pane label="通用错题集" name="second"></el-tab-pane>
      </el-tabs>
      <div style="position:relative">
        <div v-for="(list, index) in myErrorList" :key="index" class="item-row" v-show="index < 2 || isShow">
          <div class="item-title">{{ list.title }}</div>
          <el-checkbox-group v-model="selectedList[list.title]">
            <el-checkbox-button v-for="(l, index) in list.items" :key="index" :value="l.label">{{ l.label
            }}</el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div v-if="myErrorList.length > 2" style="position: absolute; right: 10px;bottom: 10px; cursor: pointer;"
          @click="isShow = !isShow">
          <el-icon style="color: #666;size: 18px;">
            <component :is="isShow ? ArrowUp : ArrowDown" />
          </el-icon>
        </div>

      </div>

    </div>
    <div>
      <div v-for="list in myErrorList" :key="list.title">
        <div v-if="selectedList[list.title]?.length">
          <span>{{ list.title }}</span>
        </div>
        <div v-for="selectedLabel in selectedList[list.title]" :key="selectedLabel" style="margin-top: 8px;">
          <span style="color: rgb(0, 152, 64);">{{ selectedLabel }}</span>
          <el-table :data="list.items.find(item =>
            item.label === selectedLabel)?.tableData
            " border style="width: 100%;" >
            <el-table-column prop="content" label="考核内容(一级)" width="190">
              <template #default="scope">
                {{ scope.$index + 1 }} . {{ scope.row.content }}
              </template>
            </el-table-column>
            <el-table-column prop="points" label="考核要点(二级)" width="360">
              <template #default="scope">
                {{ scope.$index + 1 }} . {{ scope.row.points }}
              </template>
            </el-table-column>
            <el-table-column prop="standard" label="评分标准(三级)" width="360"> </el-table-column>
            <el-table-column prop="frequency" label="出错频次" width="150"> </el-table-column>
            <el-table-column prop="remark" label="备注" width="290"> </el-table-column>
          </el-table>

        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { reactive, ref,onMounted } from 'vue'

const activeName = ref('first')
const handleClick = (tab: any) => {
  console.log(tab)
}

const selectedList: Record<string, string[]> = reactive({
  // [myErrorList.value[0].title]:[myErrorList.value[0]?.items[0]?.label],
  // [myErrorList.value[1].title]:[myErrorList.value[1]?.items[0]?.label]

})
const isShow = ref(false)



// 标签+表格数据
const myErrorList = ref([
  {
    title: "车站控制设备",
    items: [
      {
        label: "HMI/ATS信号系统",
        tableData: [
          { content: "1.基础知识", points: "1.信号工作站报警的分类及意义", standard: "弹出式告警、A级告警、B级告警、C级告警、事件", frequency: "4次", remark: "B级告警回答错误" },
          { content: "3.系统操作", points: "3.进路操作", standard: "掌握自动折返进路与折返进路的相互转换", frequency: "4次", remark: "折返进路转换错误" },
          { content: "3.系统操作", points: "5.信号工作站操作要求", standard: "未经行调允许操作安全相关命令。（行调同意）", frequency: "3次", remark: "未经行调同意操作" },
          { content: "3.系统操作", points: "5.信号工作站操作要求", standard: "操作相关指令执行“眼看、手指、口呼”", frequency: "3次", remark: "未按要求执行" }
        ]
      },
      {
        label: "IBP/MCP控制盘",
        tableData: [
          { content: "2.应急操作", points: "1.IBP盘紧急停车按钮使用", standard: "按压紧急停车按钮后必须立即汇报行调，确认后方可复位", frequency: "2次", remark: "未汇报直接复位按钮" },
          { content: "2.应急操作", points: "2.IBP盘信号相关指令操作", standard: "紧急情况下方可操作IBP盘信号按钮，操作后记录备案", frequency: "3次", remark: "非紧急情况违规操作" },
          { content: "1.设备认知", points: "3.IBP盘面按钮功能识别", standard: "能准确识别各按钮对应功能，无混淆", frequency: "1次", remark: "按钮功能识别错误" }
        ]
      },
      {
        label: "ISCS综合监控系统",
        tableData: [
          { content: "1.基础监控", points: "1.车站环控设备状态查看", standard: "每30分钟巡检一次风机、水泵、空调运行状态", frequency: "5次", remark: "巡检频次不足漏检" },
          { content: "2.故障处理", points: "2.设备报警信息确认", standard: "报警信息弹出后需第一时间核实点位及故障类型", frequency: "2次", remark: "未及时确认报警信息" },
          { content: "3.权限操作", points: "3.远程设备启停要求", standard: "远程操作设备需双人确认，禁止单人擅自操作", frequency: "2次", remark: "单人违规远程操作" }
        ]
      },
      {
        label: "EST3/FC726/FAS工作站",
        tableData: [
          { content: "1.火灾报警", points: "1.火警点位确认流程", standard: "报警后核对编码、区域、联动设备是否匹配一致", frequency: "1次", remark: "点位区域核对错误" },
          { content: "2.设备操作", points: "2.声光报警器通断设置", standard: "车控室火灾报警主机声光报警器保持通位状态", frequency: "4次", remark: "误调至断位状态" },
          { content: "2.设备操作", points: "3.空气采样复位操作", standard: "复位前需确认现场无火情，复位后观察运行状态", frequency: "3次", remark: "未确认现场直接复位" }
        ]
      },
      {
        label: "可视化接地装置",
        tableData: [
          { content: "1.安全规范", points: "1.接地操作前检查", standard: "操作前确认接地装置无破损、线路连接牢固", frequency: "2次", remark: "未做操作前检查" },
          { content: "2.标准操作", points: "2.接地挂设流程", standard: "严格执行先接地后作业，先拆线后撤离的原则", frequency: "3次", remark: "流程顺序颠倒违规" },
          { content: "3.状态确认", points: "3.接地完成核验", standard: "挂设完成后查看指示灯状态是否正常接地", frequency: "1次", remark: "未核验接地状态" }
        ]
      },
      {
        label: "CCTV/门禁/广播操作",
        tableData: [
          { content: "1.监控查看", points: "1.车站摄像头调阅", standard: "突发情况快速调阅对应区域摄像头，画面清晰无卡顿", frequency: "4次", remark: "调阅摄像头速度过慢" },
          { content: "2.门禁控制", points: "2.通道门禁开关权限", standard: "仅值班人员有权限开启门禁，做好人员登记", frequency: "2次", remark: "未登记开启门禁" },
          { content: "3.广播播报", points: "3.车站广播话术规范", standard: "播报内容清晰、语速适中、用词标准无口语化", frequency: "3次", remark: "播报话术不规范" }
        ]
      },
      {
        label: "设备管理",
        tableData: [
          { content: "1.设备管理", points: "1.设备管理", standard: "设备管理", frequency: "1次", remark: "设备管理" }
        ]
      },
      {
        label: "设备管理2",
        tableData: [
          { content: "1.设备管理", points: "1.设备管理", standard: "设备管理", frequency: "1次", remark: "设备管理" }
        ]

      },
      {
        label: "设备管理3",
        tableData: [
          { content: "1.设备管理", points: "1.设备管理", standard: "设备管理", frequency: "1次", remark: "设备管理" }
        ]
      },{
        label: "设备管理4",
        tableData: [
          { content: "1.设备管理", points: "1.设备管理", standard: "设备管理", frequency: "1次", remark: "设备管理" }
        ]
      },
      {
        label: "设备管理5",
        tableData: [
          { content: "1.设备管理", points: "1.设备管理", standard: "设备管理", frequency: "1次", remark: "设备管理" }
        ]
      }
    ]
  },
  {
    title: "车站应用操作系统",
    items: [
      {
        label: "EAM/气象/安全防汛/知识/绕行",
        tableData: [
          { content: "状态识别", points: "1.报警通断开关", standard: "1.车控室EST3火灾报警主机声光报警器处于“通位”状态", frequency: "5次", remark: "B级告警回答错误" },
          { content: "设备操作", points: "4.空气采样复位", standard: "掌握自动折返进路与折返进路的相互转换", frequency: "2次", remark: "未经行调同意操作" },
          { content: "设备操作", points: "4.空气采样复位", standard: "未经行调允许操作安全相关命令。（行调同意）", frequency: "1次", remark: "未经行调同意操作" },
          { content: "设备操作", points: "5.信号工作站操作要求", standard: "操作相关指令执行“眼看、手指、口呼”", frequency: "1次", remark: "未按要求执行" }
        ]
      },
      {
        label: "施工管理系统",
        tableData: [
          { content: "1.施工报备", points: "1.施工计划提报规范", standard: "施工计划需提前24小时提报审批，审批通过方可施工", frequency: "4次", remark: "未审批擅自施工" },
          { content: "2.现场管理", points: "2.施工人员登记", standard: "施工人员进场需核对证件、登记信息，佩戴工牌", frequency: "2次", remark: "未登记放行施工人员" },
          { content: "3.施工收尾", points: "3.施工区域清理要求", standard: "施工完成后清理现场杂物，恢复设备正常状态", frequency: "3次", remark: "未清理现场遗留杂物" }
        ]
      },
      {
        label: "SC操作系统",
        tableData: [
          { content: "1.乘客信息", points: "1.站内信息发布规范", standard: "发布通知需核对内容、区域、时间，准确无误后推送", frequency: "2次", remark: "发布区域选择错误" },
          { content: "2.设备监控", points: "2.闸机状态查看", standard: "实时查看闸机运行状态，故障及时上报处理", frequency: "3次", remark: "未及时上报闸机故障" },
          { content: "3.权限管理", points: "3.系统登录要求", standard: "专人专用账号，禁止共用账号登录操作", frequency: "1次", remark: "共用账号违规登录" }
        ]
      },
      {
        label: "BOM操作系统",
        tableData: [
          { content: "1.票务处理", points: "1.乘客购票退票操作", standard: "按规定流程办理票务业务，耐心解答乘客疑问", frequency: "5次", remark: "退票流程操作错误" },
          { content: "2.异常处理", points: "2.车票故障核验", standard: "车票异常时核对票种、有效期、余额等信息", frequency: "2次", remark: "未核验直接处理" },
          { content: "3.账目核对", points: "3.每日营收对账", standard: "下班前核对营收金额与票务记录一致，签字确认", frequency: "2次", remark: "未对账直接交接" }
        ]
      }
    ]
  },
  {
    title: "其他",
    items: [
      {
        label: "其他",
        tableData: [
          { content: "1.设备操作", points: "1.设备操作", standard: "设备操作要求", frequency: "1次", remark: "设备操作错误" },
          { content: "2.设备操作", points: "2.设备操作", standard: "设备操作要求", frequency: "1次", remark: "设备操作错误" },
        ]
      }
    ]
  },
 {
  title:"技能分类",
  items: [
    {
      label: "技能分类",
      tableData: [
        { content: "1.技能分类", points: "1.技能分类", standard: "技能分类", frequency: "1次", remark: "技能分类错误" },
        { content: "2.技能分类", points: "2.技能分类", standard: "技能分类", frequency: "1次", remark: "技能分类错误" },
      ]
    }
  ]
 }

]);




</script>


<style scoped>
/* 我的错题集的类和小类横放 */
.item-row {
  display: flex;
  align-items: center;
  padding-top: 8px;
}

/* 大类 */
.item-title{
  padding-right: 10px;
}

/* 我的错题集按钮样式 */
:deep(.el-checkout-group) {
  display: flex;
  border: none;
}

/* 表格行头样式 */
:deep(.el-table__header .el-table__cell) {
  text-align: center;
  background-color: rgb(241, 250, 247);
}

/* 表格内容样式 */
:deep(.el-table__body .el-table__cell) {
  text-align: center;
}

/* 表格整体样式 */
:deep(.el-table) {
  margin-top: 5px;
  box-shadow: 0 0 10px #ddd;
}

/* 调整字体颜色 */
:deep(.el-table__body .el-table__cell:nth-child(4)){
  color: red !important; 
  font-size: 20px;
}

/* 标签页样式 */
.tab {
  border-radius: 5px;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
}
</style>