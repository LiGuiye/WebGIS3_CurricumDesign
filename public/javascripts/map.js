var map;
var view;
//所有站点的点图层
var allPoints;
//弹出框里的回调函数
var addressChange;
// 用户选择的时间,默认为2019-5-21
var selectText = "2019-5-21";
require(["esri/Map",
		"esri/views/MapView",
		"esri/layers/GeoJSONLayer",
		"esri/widgets/Search",
		"esri/widgets/Expand",
		"esri/Graphic",
		"esri/layers/FeatureLayer",
		"esri/renderers/smartMapping/creators/color",
		"esri/renderers/smartMapping/statistics/histogram",
		"esri/widgets/ColorSlider",
		"esri/core/lang",
	],
	function(
		Map,
		MapView,
		GeoJSONLayer,
		Search,
		Expand,
		Graphic,
		FeatureLayer,
		colorRendererCreator,
		histogram,
		ColorSlider,
		lang,
	) {
		//定义地图基本要素
		map = new Map({
			basemap: "topo",
		});
		view = new MapView({
			container: "mapDiv",
			map: map,
			scale: 25000000,
			center: [114, 31],
			popup: {
				actions: [],
				dockEnabled: false, //停靠在右侧
				dockOptions: {
					buttonEnabled: true, //显示停靠按钮
					breakpoint: false,
					position: "bottom-right",
				}
			}
		});
		//站点的弹出框
		var allStationsTemplate = {
			title: "气象站点信息",
			content: "地址：{Code}{Place}{Place:addressChange}"
		};
		
		addressChange = function(value, key, data) {
			// var date = document.getElementById("birthday").value;
			// var date = "2019-06-04";
			var date = $("#date").find("option:selected").text();
			showEcharts(date, data.Code, data.Place);
			return;
		};
		//发布到arcgisonline上后误差过大
		// allPoints = new FeatureLayer({
		// 	portalItem: { // autocasts as esri/portal/PortalItem
		// 		id: "67bfdc9666e9463398deb3eb2e90c329"
		// 	}
		// });
		//站点总图层
		allPoints = new GeoJSONLayer({
			url: "data/allStationsPoints.json",
			copyright: "All Stations Points",
			popupTemplate: allStationsTemplate,
			outFields: ["*"]
		});
		map.add(allPoints);
		view.ui.add("titleDiv", "top-right");
		// 刷新之后才会重新执行，写在ajax查询成功的回调函数里发现没用，不知道怎么回事
		//根据aqi渲染点的颜色和左下角的滑块
		myRenderer();
	});

//根据aqi值渲染样式
function myRenderer() {
	require(["esri/renderers/smartMapping/creators/color", "esri/renderers/smartMapping/statistics/histogram",
		"esri/widgets/ColorSlider",
		"esri/core/lang",
	], function(colorRendererCreator, histogram, ColorSlider, lang) {
		var colorParams = {
			layer: allPoints,
			basemap: map.basemap,
			view: view,
			// valueExpression: "if($feature.id<400){return x1}else if($feature.id<1000){return y2}else{return z3}",
			// valueExpression: 'for (var i;i<address.length;i++) {if($feature.Address == address[i]){return aqi[i]}else{return 0}}',
			valueExpression: '$feature.id',

			// field: "id",
			// normalizationField: "id",
			theme: "above-and-below"
		};
		var sliderParams = {
			numHandles: 3,
			syncedHandles: true,
			container: "slider"
		};
		colorRendererCreator
			.createContinuousRenderer(colorParams)
			.then(function(response) {
				// set the renderer to the layer and add it to the map
				allPoints.renderer = response.renderer;
				// renderer.valueExpression = 'parseInt($feature.OBJECTID)';
				map.add(allPoints);

				// add the statistics and color visual variable objects
				// to the color slider parameters

				sliderParams.statistics = response.statistics;
				sliderParams.visualVariable = response.visualVariable;

				// generate a histogram for use in the slider. Input the layer
				// and field or arcade expression to generate it.
				return histogram({
					layer: allPoints,
					// view:view,
					field: 'id',
					// valueExpression : "parseInt($feature.OBJECTID)",
					// normalizationField: "TOTPOP_CY"
				});
			})
			.then(function(histogram) {
				//是否添加直方图
				sliderParams.histogram = histogram;

				// input the slider parameters in the slider's constructor
				// and add it to the view's UI
				var colorSlider = new ColorSlider(sliderParams);
				view.ui.add("containerDiv", "bottom-left");

				// when the user slides the handle(s), update the renderer
				// with the updated color visual variable object
				colorSlider.on("data-change", function() {
					var renderer = allPoints.renderer.clone();
					renderer.visualVariables = [
						lang.clone(colorSlider.visualVariable)
					];
					allPoints.renderer = renderer;
				});
			})
			.catch(function(error) {
				console.log("there was an error: ", error);
			});

	});
}

//点击提交按钮后执行查询、修改json和页面刷新
document.getElementById("submit").addEventListener("click", function() {
	selectText = $("#date").find("option:selected").text();
	document.getElementById("birthday").value = selectText;
	//获取该时间的aqi并进行渲染
	// searchDate('2019-5-19');
	searchDate(selectText);
	//提醒用户选择成功
	alert("选择成功");
	//更改后隔3s刷新
	setTimeout("location.reload();", 3000);
	return selectText;
});

//数据库查询对应时间的aqi数据并更改json信息
function searchDate(date) {
	$.ajax({
		url: "/date?date=" + date,
		context: document.body,
		success: function(data) {}
	});
}
//显示Echarts
function showEcharts(selectText, code, place) {
	//x轴是时间
	var xData = [];
	var aqi = [];
	var co = [];
	var no2 = [];
	var o3 = [];
	//o3/8h
	var o38 = [];
	var pm10 = [];
	//pm2.5
	var pm2 = [];
	var so2 = [];
	$.ajax({
		url: "/searchDetails?date=" + selectText + "&code=" + code + "&place=" + place,
		context: document.body,
		success: function(result) {
			for (var i=0;i<result.length;i++) {
				xData[i] = result[i].time;
				aqi[i] = result[i].aqi;
				co[i] = result[i].co;
				no2[i] = result[i].no2;
				o3[i] = result[i].o3;
				o38[i] = result[i].o38;
				pm10[i] = result[i].pm10;
				pm2[i] = result[i].pm2;
				so2[i] = result[i].so2;
			}
			console.log(result);
			changeData(selectText,xData,aqi,co,no2,o3,o38,pm10,pm2,so2);
		}
	});
}
function changeData(selectText,xData,aqi,co,no2,o3,o38,pm10,pm2,so2){
	var option = {
    title : {
        text: selectText
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['aqi','co','no2','o3','o38','pm10','pm2','so2']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: false},
            dataView : {show: false, readOnly: false},
            magicType : {show: false, type: ['line', 'bar']},
            restore : {show: false},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            // data : ['周一','周二','周三','周四','周五','周六','周日']
			//x轴是时间
			data : xData
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                // formatter: '{value} °C'
				//y轴后面可以跟单位
				formatter: '{value}'
            }
        }
    ],
    series : [
        {
            name:'aqi',
            type:'line',
            data:aqi,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        },
        {
            name:'co',
            type:'line',
            data:co,
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        },
		{
		    name:'no2',
		    type:'line',
		    data:no2,
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		},
		{
		    name:'o3/h',
		    type:'line',
		    data:o3,
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		},
		{
		    name:'o3/8h',
		    type:'line',
		    data:o38,
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		},
		{
		    name:'pm10',
		    type:'line',
		    data:pm10,
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		},
		{
		    name:'pm2',
		    type:'line',
		    data:pm2,
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		},
		{
		    name:'so2',
		    type:'line',
		    data:so2,
		    markPoint : {
		        data : [
		            {type : 'max', name: '最大值'},
		            {type : 'min', name: '最小值'}
		        ]
		    },
		    markLine : {
		        data : [
		            {type : 'average', name: '平均值'}
		        ]
		    }
		},
	]
};
	myChart.setOption(option);
	//打开模态框
	openModal();
}
function openModal() {
	$('#myModal').modal('show')
}
