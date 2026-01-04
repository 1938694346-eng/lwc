<template>
  <!-- 最外层垂直容器 -->
  <div style="display: flex; flex-direction: column; height: 100vh; margin: 0; padding: 0; overflow: hidden;">
    <!-- 顶部栏 -->
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #fff; padding: 0 20px; width: 100%; line-height: 60px; background-color: rgb(0, 153, 67);">
      <span style="font-size: 20px;">员工画像系统</span>
      <div style="display: flex; align-items: center;">
        <el-avatar icon="el-icon-user" size="small" style="margin-right: 8px; vertical-align: middle"></el-avatar>
        <span style="vertical-align: middle">啥啥啥</span>
      </div>
    </div>

    <!-- 中间水平容器（包裹导航区和内容区） -->
    <div style="display: flex; flex: 1; height: 100%; overflow: hidden;">
      <!-- 导航区 -->
      <div style="width: 150px; background-color: rgb(231, 245, 237); height: 100%; padding-top: 10px;">
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          style="border-right: none; height: 100%; min-height: calc(100vh - 60px); background-color: rgb(231, 245, 237);"
          @select="handleMenuSelect"
          unique-opened
        >
          <!-- ✅ 画像模块 终极修复核心区【重点修改】 -->
          <el-sub-menu index="portrait" ref="portraitSubMenuRef">
            <template #title>
              <div class="submenu-title-box" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <!-- ✅ 1. 文字+图标区：点击只跳转页面，加 @click.stop.prevent 双修饰符 -->
                <div 
                  style="display: flex; align-items: center; cursor: pointer;"
                  @click.stop.prevent="handleSubMenuTitleClick"
                >
                  <User style="width: 30px; height: 20px;"/>
                  <span>画像模块</span>
                </div>
                <!-- ✅ 2. 自定义箭头：点击只展开/收起菜单，加 @click.stop 修饰符 -->
                <ArrowDown 
                  class="custom-arrow-icon" 
                  style="width: 16px; height: 16px; cursor: pointer;"
                  @click.stop="handleArrowToggle"
                />
              </div>
            </template>
            <el-menu-item index="score-details">成绩详情</el-menu-item>
          </el-sub-menu>

          <!-- 其他菜单 完全不变 -->
          <el-menu-item index="plan">
            <EditPen style="width: 30px; height: 20px;"/>
            <span>计划模块</span>
          </el-menu-item>
          <el-menu-item index="analysis">
            <Histogram style="width: 30px; height: 20px;"/>
            <span>分析模块</span>
          </el-menu-item>
          <el-menu-item index="human-factor">
            <Monitor style="width: 30px; height: 20px;"/>
            <span>人因模块</span>
          </el-menu-item>
          <el-menu-item index="report">
            <Document style="width: 30px; height: 20px;"/>
            <span>报表模块</span>
          </el-menu-item>
          <el-menu-item index="error-collection">
            <Close style="width: 30px; height: 20px;"/>
            <span>错题集</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 内容展示区 -->
      <div style="flex: 1; padding: 20px; background-color: #fff; height: 100%; width: 100%; box-sizing: border-box; overflow-y: auto;">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// 导入所有需要的图标 无遗漏
import { User, EditPen, Histogram, Monitor, Document, Close, ArrowDown } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const activePath = ref('portrait');
// ✅ 新增：给el-sub-menu绑定ref，手动控制展开/收起状态
const portraitSubMenuRef = ref<any>(null);

// 根据当前路由设置激活菜单项 (原有逻辑 完全不变)
const updateActivePath = () => {
  const currentPath = route.name as string;
  const pathMap: Record<string, string> = {
    Portrait: 'portrait',
    ScoreDetails: 'score-details',
    Plan: 'plan',
    Analysis: 'analysis',
    HumanFactor: 'human-factor',
    Report: 'report',
    ErrorCollection:'error-collection'
  };
  if(pathMap[currentPath]){
    activePath.value = pathMap[currentPath];
  }
};

// 处理菜单子项选择事件 (原有逻辑 完全不变)
const handleMenuSelect = (index: string) => {
  const routeMap: Record<string, string> = {
    'portrait': 'Portrait',
    'score-details': 'ScoreDetails',
    'plan': 'Plan',
    'analysis': 'Analysis',
    'human-factor': 'HumanFactor',
    'report': 'Report',
    'error-collection': 'ErrorCollection'
  };
  const routeName = routeMap[index];
  if (routeName) {
    router.push({ name: routeName });
  }
};

// ✅ 核心1：点击画像模块【文字+图标区】→ 只跳转页面，完全不展开菜单
const handleSubMenuTitleClick = () => {
  activePath.value = 'portrait';
  if(route.name !== 'Portrait'){
    router.push({ name: 'Portrait' });
  }
};

// ✅ 核心2：点击【自定义箭头】→ 只手动控制展开/收起菜单，完全不跳转页面
const handleArrowToggle = () => {
  if(portraitSubMenuRef.value){
    // 手动切换子菜单的展开/收起状态，原生方法，无bug
    portraitSubMenuRef.value.toggle();
  }
};

// 组件挂载+路由监听 原有逻辑 完全不变
onMounted(() => {
  updateActivePath();
});
watch(route, () => {
  updateActivePath();
}, { immediate: true, deep: true });
</script>

<style scoped>
:deep(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.el-header {
  background-color: rgb(0, 153, 67);
  line-height: 60px;
  margin: 0;
}

.el-aside {
  color: var(--el-text-color-primary);
  padding-top: 10px;
}

:deep(.el-menu-item) {
  line-height: 60px !important;
	height: 60px;
}

/* ✅ 核心样式1：隐藏Element原生的箭头图标 必加 */
/* :deep(.el-sub-menu .el-sub-menu__icon-arrow) {
  display: none !important;
} */

/* ✅ 核心样式2：自定义箭头的旋转动画+过渡，展开/收起丝滑，和原生效果一致 */
:deep(.custom-arrow-icon) {
  transition: transform 0.2s ease-in-out;
}
/* 菜单收起时，箭头旋转180度 */
:deep(.el-sub-menu.is-collapse .custom-arrow-icon) {
  transform: rotate(180deg);
}
</style>