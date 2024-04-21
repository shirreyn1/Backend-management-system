<template>
    <div class="box4" ref="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
var planePath =
    'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z'
onMounted(() => {
    let mychart = echarts.init(map.value)
    //设置配置项
    mychart.setOption({
        //地图组件
        geo: {
            map: 'china', //中国地图
            roam: true, //鼠标缩放的效果
            //地图的位置调试
            top: 220,
            zoom: 1.5,
            //地图上的文字的设置
            label: {
                show: true, //文字显示出来
                color: 'white',
                fontSize: 16,
            },
            itemStyle: {
                //每一个多边形的样式
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#4d78c7', // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: '#061f4d', // 100% 处的颜色
                        },
                    ],
                    global: false, // 缺省为 false
                },
                opacity: 0.8,
            },
            //地图高亮的效果
            emphasis: {
                itemStyle: {
                    color: '#78a3f4',
                },
                label: {
                    fontSize: 40,
                    color: '#15233d',
                },
            },
        },
        //布局位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        },
        series: [
            {
                type: 'lines', //航线的系列
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989], // 起点
                            [119.306239, 26.075302], // 终点
                        ],
                    },
                    {
                        coords: [
                            [103.9526, 30.7617], // 起点
                            [109.5227, 18.2577], // 终点
                        ],
                    },
                    {
                        coords: [
                            [116.405285, 39.904989], // 起点
                            [114.298572, 30.584355], // 终点
                        ],
                    },
                    {
                        coords: [
                            [103.9441, 33.1649],
                            [120.24, 46.55, 100],
                        ],
                    },
                ],
                //开启动画特效
                lineStyle: {
                    color: '#9fbbef',
                    width: 3,
                    opacity: 0.7,
                    curveness: 0.2,
                },
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    color: '#fff',
                    symbolSize: 15,
                },
            },
        ],
    })
})
</script>

<style scoped>
.c {
    color: #8bb2f6;
}
</style>
