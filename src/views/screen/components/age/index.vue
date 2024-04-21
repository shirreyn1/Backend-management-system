<template>
    <div class="box2">
        <div class="title">
            <p>年龄比例</p>
            <img src="../../images/dataScreen-title.png" alt="" />
        </div>
        <!-- 图形图标的容器 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入echarts
import * as echarts from 'echarts'
let charts = ref()
//组件挂载完毕初始化图形图标
onMounted(() => {
    let mychart = echarts.init(charts.value)
    //设置配置项
    let option = {
        title: {
            text: '今日人数',
            right: '39%',
            top: '40%',
            textAlign: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 22,
                fontWeight: '400',
            },
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            right: 70,
            top: 40,
            orient: 'vertical', //图例组件方向的设置
            textStyle: {
                color: 'white',
                fontSize: 20,
            },
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['50%', '90%'],
                avoidLabelOverlap: false,
                right: 70,
                bottom: 20,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    position: 'inside',
                    color: 'white',
                    fontSize: 18,
                },

                labelLine: {
                    show: false,
                },
                data: [
                    { value: 1048, name: '青年' },
                    { value: 735, name: '老年' },
                    { value: 580, name: '中年' },
                    { value: 484, name: '少年' },
                    { value: 300, name: '其他' },
                ],
            },
        ],
        //调整图形图标的位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
    }
    mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
        margin-left: 20px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .charts {
        height: 260px;
    }
}
</style>
