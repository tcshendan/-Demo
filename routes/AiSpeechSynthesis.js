var express=require('express');
var router=express.Router();
var fs=require('fs');
var AipSpeechServer = require('baidu-aip-sdk').speech;

//设置appid/appkey/appsecret
var APP_ID = "11034819";
var API_KEY = "6OfBkVNAHblCEGrX6xCpLO0T";
var SECRET_KEY = "7e3c3dcfdbd39007060cfacd1e191b43";

// 新建一个对象，建议只保存一个对象调用服务接口
var client =new AipSpeechServer(APP_ID, API_KEY, SECRET_KEY);

// 语音合成
router.post('/speech', function(req, res, next){
  //console.log('./public/audio/');
  console.log(req.body);//用这种content-type=www-form-urlencoded才能获取到参数
  //console.log(req.body.text.length);
  //return ;
  client.text2audio(
    req.body.text || '你好，百度语音合成测试',
    {
      //cuid: '机器 MAC 地址或 IMEI 码，长度为60以内',
      spd: req.body.spd || '5',//音速
      pit: req.body.pit || '5',//音调
      vol: req.body.vol || '5',//音量
      per: req.body.per || '0'//播音角色
    }
  )
  .then(
    function(res1){
      console.log(res1.data);
      if(res1.data){
        //console.log(res1);
        fs.writeFileSync('./public/audio/tts.audio.mp3', res1.data);

        res.json({
          ret: 0,
          data:{
            path: 'http://localhost:3000/audio/tts.audio.mp3'//返回小程序调用播放
          },
          msg: ''
        });

      }else{
        // 服务发生错误
        console.log(res1);
        res.json({
          ret: res1.err_no,
          data:{
          },
          msg: res1.err_msg
        });
      }
    },
    function(e){
      // 发生网络错误
      console.log(e);
      res.json({
        ret: -100,
        data:{
        },
        msg: '网络错误，请检查网络'
      });
    }
  );
});

module.exports=router;
