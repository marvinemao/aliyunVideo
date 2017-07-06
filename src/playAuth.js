var TokenGenerator = require('uuid-token-generator'),
    superagent = require('superagent'),
    jsSHA = require("jssha");

var VideoPlayAuth = function (accessKeyId, accessKeySecret, vid) {
	var tokgen = new TokenGenerator(), //生成随机串
		  shaObj = new jsSHA("SHA-1", "TEXT"); //加密

	//公共参数键值对
	var arr = ['Action', 'Version', 'AccessKeyId', 'Timestamp', 'SignatureMethod', 'SignatureVersion', 'SignatureNonce', 'Format', 'VideoId'];
	var obj = {
		Action: 'GetVideoPlayAuth',
		Version: '2017-03-21',
		AccessKeyId: accessKeyId,
		Timestamp: nowTime(),
		SignatureMethod: 'HMAC-SHA1',
		SignatureVersion: '1.0',
		SignatureNonce: tokgen.generate(),
		Format: 'JSON',
		VideoId: vid
	};

	var lastArr = arr.sort(), //参数名序列化
			str = '';

	//组装
	for(var i in lastArr) {
		if(i == lastArr.length-1) {
			str += encodeURIComponent(lastArr[i]) + '=' + encodeURIComponent(obj[lastArr[i]]);
		} else {
			str += encodeURIComponent(lastArr[i]) + '=' + encodeURIComponent(obj[lastArr[i]]) + '&';
		}
	}

	//编码串
	var StringToSign = 'GET'+'&'+'%2F'+'&'+encodeURIComponent(str);

	//加密
	shaObj.setHMACKey(accessKeySecret+'&', "TEXT");
	shaObj.update(StringToSign);

	var hmac = shaObj.getHMAC("B64");

	//生成请求地址
	var requestURL = 'http://vod.cn-shanghai.aliyuncs.com/?';
	for(var i in arr) {
		if(i == arr.length-1) {
			requestURL += arr[i]+ '=' + obj[arr[i]];
		} else {
			requestURL += arr[i] + '=' + obj[arr[i]] + '&';
		}
	}
	requestURL = requestURL + '&Signature=' + hmac;

	//请求数据
  return new Promise(function(resolve, reject) {
  	  superagent
		  .get(requestURL)
		  .end(function(err, sres) {
		  	if(err) {
		  		reject(err);
		  	}
		  	resolve(sres.text);
		  });
  });
}


//判断是否大于10
function isGreat(data) {
	return data > 10 ? data : ('0'+data);
}

/**
 * 生成固定时间格式
 * @author mao
 * @version version
 * @date    2017-07-06
 * @return  {string}   2017-03-29T12:09:11Z
 */
function nowTime() {
	var t = new Date();
	var time = t.getUTCFullYear() +'-'+isGreat(t.getUTCMonth() + 1)+'-'+isGreat(t.getUTCDate())+'T'+isGreat(t.getUTCHours())+':'+isGreat(t.getUTCMinutes())+':'+isGreat(t.getUTCSeconds())+'Z';

	return time;
}

module.exports = VideoPlayAuth;