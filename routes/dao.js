var pg = require('pg');//引用pg模板
// 47.92.246.52/
// var conString = "postgres://postgres:313616@47.92.246.52:5432/AirQuality";
var conString = "postgres://postgres:313616@localhost:5432/myAirQuality";
//数据库连接，数据库类型为postgres，用户名为postgres，密码为313616，服务器名称为locahost，端口号为5432，数据库名称为myAirQuality
var client = new pg.Client(conString); 
//新建客户端对象
var PG = function(){
	console.log("准备向****数据库连接...");
};
PG.prototype.getConnection = function(){ 
	client.connect(function (err) { 
        if (err) 
			{ 
				return console.error('could not connect to postgres', err); 
			} 
        client.query('SELECT NOW() AS "theTime"', function (err, result) { 
        if (err) 
			{ 
                return console.error('error running query', err); 
            } 
            console.log("postgres数据库连接成功..."); 
        }); 
    }); 
}; //获得连接

var clientHelper = function(str,value,cb){ 
    client.query(str,value,function(err,result){ 
        if(err) { 
            cb("err"); //回调函数
        } 
        else{ 
            if(result.rows != undefined) 
                cb(result.rows); 
            else 
                cb(); 
        } 
    }); 
} //查询函数定义

PG.prototype.save = function(tablename,fields,cb){ 
    if(!tablename) return; 
    var str = "insert into "+tablename+"("; 
    var field = []; 
    var value = []; 
    var num = []; 
    var count = 0; 
    for(var i in fields){ 
        count++; 
        field.push(i); 
        value.push(fields[i]); 
        num.push("$"+count); 
    } 
    str += field.join(",") +") values("+num.join(",")+")"; 
    clientHelper(str,value,cb); 
};//填表函数定义

PG.prototype.remove = function(tablename,fields,cb){ 
    if(!tablename) return; 
    var str = "delete from "+tablename+" where "; 
    var field = []; 
    var value = []; 
	var count = 0; 
    for(var i in fields){ 
        count++; 
        field.push(i+"=$" +count); 
        value.push(fields[i]); 
    } 
    str += field.join(" and "); 
    clientHelper(str,value,cb); 
}//删除函数定义

PG.prototype.update = function(tablename,mainfields,fields,cb){ 
    if(!tablename) return; 
    var str = "update "+tablename+" set "; 
    var field = []; 
    var value = []; 
    var count = 0; 
    for(var i in fields){ 
        count++; 
        field.push(i+"=$"+count); 
        value.push(fields[i]); 
    }
	str += field.join(",") +" where "; 
    field = []; 
    for(var j in mainfields){ 
        count++; 
        field.push(j+"=$"+count);
		value.push(mainfields[j]); 
    } 
    str += field.join(" and "); 
    clientHelper(str,value,cb); 
}//修改函数定义

PG.prototype.select = function(tablename,fields,returnfields,cb){ 
    if(!tablename) return; 
    var returnStr = ""; 
    if(returnfields.length == 0) 
        returnStr = '*'; 
    else 
        returnStr= returnfields.join(","); 
    var str = "select "+returnStr+ " from "+tablename+" where "; 
    var field = []; 
    var value = []; 
    var count = 0; 
    for(var i in fields){ 
        count++; 
        field.push(i+"=$"+count); 
        value.push(fields[i]); 
    } 
    str += field.join(" and "); 
    clientHelper(str,value,cb); 
}; //查询函数定义

//关联字段查询属性数据库函数
PG.prototype.selectvetByCode = function(tablename,fields,returnfields,cb){
	if(!tablename)return;
	var returnStr = "";
	//如果返回字段为空
	if(returnfields.length == 0)
	//代表返回所有字段
		returnStr = '*';
	else
	//否则返回指定的字段
		returnStr = returnfields.join(",");
	var str ='';
	//如果条件字段为空
	if(fields.length == 0)
	//则查询该表的所有数据
	str = "select"+returnStr+"from"+tablename;
	else
	//否则根据条件字段进行查询
	    str = "select"+returnStr+" from "+tablename+" where vet_fid = '"+ fields+"' order by kind";
//		str = "select"+returnStr+" from "+tablename+" where vet_fid = '"+ fields+"' order by kind";
	clientHelper(str,'',cb);
};

//关联字段查询属性数据库函数
PG.prototype.selectgradeByCode = function(tablename,fields,returnfields,cb){
	if(!tablename)return;
	var returnStr = "";
	//如果返回字段为空
	if(returnfields.length == 0)
	//代表返回所有字段
		returnStr = '*';
	else
	//否则返回指定的字段
		returnStr = returnfields.join(",");
	var str ='';
	//如果条件字段为空
	if(fields.length == 0)
	//则查询该表的所有数据
	str = "select"+returnStr+"from"+tablename;
	else
	//否则根据条件字段进行查询
	    str = "select"+returnStr+" from "+tablename+" where vet_fid = '"+ fields+"' order by kind";
//		str = "select"+returnStr+" from "+tablename+" where vet_fid = '"+ fields+"' order by kind";
	clientHelper(str,'',cb);
};

module.exports = new PG(); //模板输出
