var express = require('express');
var router = express.Router();
//连接数据库
var pgclient = require('./dao');
pgclient.getConnection();
//更改json
var jsonchange = require('./json')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});
router.get('/aqi', function(req, res) {
	pgclient.select('quality', {
		'aqi': req.query.aqi
	}, '', function(result) {
		console.log("query::::" + req.query.aqi);
		res.send(result)
	})
});
router.get('/date', function(req, res) {
	//根据address进行检索更改aqi
	var address = [];
	var aqi = [];
	pgclient.select('quality', {
		'date': req.query.date
	}, '', function(result) {
		if(!result){
			console.log("不好意思没有该时间的数据");
			res.send("不好意思没有该时间的数据");
		}else{
			for (var i = 0; i < result.length; i++) {
				if (parseInt(result[i].aqi)) {
					address[i] = result[i].code + result[i].place;
					aqi[i] = parseInt(result[i].aqi);
				} else {
					address[i] = result[i].code + result[i].place;
					aqi[i] = 0;
				}
			};
			//根据数据库调用的aqi值更改json文件，已达到更改地图的效果
			jsonchange.update(address,aqi);
		}
		

	});


});
//日历
router.get('/calendar', function(req, res) {
	pgclient.select('quality',{
		'date':req.query.date
	}, '', function(result) {
		// console.log("query::::" + req.query.aqi);
		res.send(result)
	})
});
//根据date,code和place查询空气质量信息,date要减去一天才是当天的我也不知道为什么
//http://localhost:3000/searchDetails?date=2019-5-22&code=东营&place=市环保局
router.get('/searchDetails', function(req, res) {
	pgclient.select('quality',{
		'date':req.query.date,
		'code':req.query.code,
		'place':req.query.place,
	}, '', function(result) {
		// console.log("query::::" + req.query.aqi);
		res.send(result);
	})
});
module.exports = router;
