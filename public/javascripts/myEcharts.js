// 返回数据插入Echarts
var myChart = echarts.init(document.getElementById('main'));
var option = {
	legend: {
		data: ['时间与aqi的变化关系']
	},
	toolbox: {
		show: true,
		feature: {
			mark: {
				show: true
			},
			dataView: {
				show: true,
				readOnly: false
			},
			magicType: {
				show: true,
				type: ['line', 'bar']
			},
			restore: {
				show: true
			},
			saveAsImage: {
				show: true
			}
		}
	},
	calculable: true,
	tooltip: {
		trigger: 'axis',
		//鼠标移上去后的提示
		formatter: "Temperature : <br/>{b}km : {c}°C"
	},
	xAxis: [{
		type: 'value',
		axisLabel: {
			formatter: '{value} °C'
		}
	}],
	yAxis: [{
		type: 'category',
		axisLine: {
			onZero: false
		},
		axisLabel: {
			formatter: '{value} km'
		},
		boundaryGap: false,
		data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
	}],
	series: [{
		name: '高度(km)与气温(°C)变化关系',
		type: 'line',
		smooth: true,
		itemStyle: {
			normal: {
				// https://echarts.baidu.com/echarts2/doc/example/line5.html#    
				lineStyle: {
					shadowColor: 'rgba(0,0,0,0.4)'
				}
			}
		},
		data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
	}]
};
myChart.setOption(option);
