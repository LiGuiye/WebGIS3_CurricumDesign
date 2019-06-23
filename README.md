# WebGIS3_CurricumDesign  
## 远程访问地址  
[点击访问：](http://47.92.246.52:4000/)  
## 系统功能和实现介绍  
### 主要用于各种空气质量参数的可视化和简单分析  
1.根据屏幕右侧的下拉框选择感兴趣的时间点后，系统将自动在后台查询相关信息并在3秒后自动刷新页面，且右上角会显示当前选择的日期。  
2.系统自动刷新页面后，地图上以AQI为参数信息对全国所有气象站的位置点进行渲染，并可以通过左下角的滑块进行颜色的调整以及不同AQI数量直方图和均值信息的查看。  
3.点击任意一个气象站的点，会弹出包含该点地址信息的弹出框。然后系统自动利用现在选择的时间信息和地址信息检索数据库，得到该点该时间的相关信息后生成ECharts表格。  
4.ECharts表格中显示当天该地方的所有空气质量参数，并生成折线图。可以选择参数的显示与隐藏。  
### 主要实现技术要点及经验  
1.利用nodejs搭建服务器，进行前后端传值交互。  
2.前端利用BootStrap和JQuery框架进行实现，地图部分使用ArcGIS API for JavaScript实现。  
3.前后端传值主要使用JQuery Ajax进行实现，可能是自身代码写的效率不高，对服务器端的负荷较大。  
4.前端空间数据为使用爬虫脚本爬取全国气象站点后，利用地理编码工具对其进行编码和解析，生成经纬度后添加至ArcGIS Desktop并生成shp，然后利用mapsharper将其转为geojson格式。  
5.由于后台属性数据库数据量过大，不方便将其全部写进属性表里。所以选择了查询到结果后修改json文件，然后利用ArcGIS API for JavaScript达到修改前端地图显示样式的效果。相当于变相修改了空间数据的属性。可能以后还是需要寻找一种更高效率的方式。  
6.修改json文件时一定要全部查询完后一次性修改，不能查询到一个结果就修改一次。那样的话会对系统读取文件造成巨大负荷，句柄瞬间耗尽并报错。  
7.目前数据库中的数据仍在定时爬取和存储，但是由于提交课程设计的时间原因，前端页面一些参数是写死的。  
## 不足  
由于时间关系，系统并不是很完善，也可能存在一些bug，用户体验不是特别好。  
如果以后有时间，希望可以继续对其进行完善，真正实现全国空气质量信息的可视化，而不是仅作为一个课程设计。
