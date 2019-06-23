var fs = require('fs');
// var params = {
//     "OBJECTID": 1,
//     "Code": "七台河",
//     "Place": "新建",
//     "Address": "777",
//     "id": 0
// }

var JsonChange = function() {
	console.log("准备向****修改数据...");
};
JsonChange.prototype.update = function(id, aqi) {
	var doc;
	var str;
	fs.readFile('./public/data/allStationsPoints.json', function(err, data) {
		if (err) {
			console.error(err);
		}
		//把json转为string
		doc = data.toString();
		//对字符串进行解析
		doc = JSON.parse(doc);
		// console.log(doc);
		//把数据读出来,然后进行修改

		for (var i = 0; i < doc.features.length; i++) {
			var data = doc.features[i].properties[key];
			for (var j = 0; j < id.length; j++) {
				var params = {
					"id": aqi[j]
				};
				if (doc.features[i].properties.Address == id[j]) {
					// console.log('id一样的');
					for (var key in params) {
						if (key == "id") {
							doc.features[i].properties[key] = params[key];
						} else {
							//不更改啥也不干，只改最后一个值
						}

					}
				}
			}
			//如果循环结束值还没变，说明没有aqi数据，改为0
			if (data == doc.features[i].properties[key]) {
				doc.features[i].properties[key] = 0;
			}

		}




		// doc.total = doc.features.length;
		// var str = JSON.stringify(doc);
		// fs.writeFile('./public/data/test.json',str,function(err){
		//     if(err){
		//         console.error(err);
		//     }
		//     console.log('--------------------修改成功');
		// })

		doc.total = doc.features.length;
		str = JSON.stringify(doc);
		fs.writeFile('./public/data/allStationsPoints.json', str, function(err) {
			if (err) {
				console.error(err);
			}
			console.log('--------------------修改成功');
		})
	});


}

// changeJson("七台河新建",params);

module.exports = new JsonChange();
