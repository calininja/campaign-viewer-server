const express = require('express');
const db = require('../models');
const request = require('request');
const cheerio = require('cheerio');
const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;
// const fs = require('fs');
// const path = require('path');
// const mime = require('mime');
express().use( '/', express.static('upload')); // 프론트 서버 upload 폴더의 파일들을 가져갈수있게 함

router.post('/campaign', ( req, res ) => {
  // console.log(req.body.device, req.body.brand, req.body.campaign);
  try {
    if( req.body.device=="web" && req.body.brand=="adidas" ) {
      let url = 'https://kibaeksa.github.io/adidasWeb/front/html/adidas/html/pn/'+req.body.campaign+'.html';
      mod(url, '#container_r ', 'adidas');
    }
    if( req.body.device=="mobile" && req.body.brand=="adidas" ) {
      let url = 'https://kibaeksa.github.io/adidasMobile/mobile/html/adidas/pn/'+req.body.campaign+'.html';
      mod(url, '#container ', 'adidas');
    }
    if( req.body.device=="web" && req.body.brand=="reebok" ) {
      let url = 'https://kibaeksa.github.io/adidasWeb/front/html/reebok/html/pn/'+req.body.campaign+'.html';
      mod(url, '#contents_wrap ', 'reebok');
      console.log(url);
    }
    if( req.body.device=="mobile" && req.body.brand=="reebok" ) {
      let url = 'https://kibaeksa.github.io/adidasMobile/mobile/html/reebok/pn/'+req.body.campaign+'.html';
      mod(url, '#contents ', 'reebok');
    }
  
    function mod ( url, container, brands ) {
      // console.log(url);
      let options = {
        uri: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
        },
        json: true 
      };
    
      request.get( options, function ( error, response, html ) {
        const $ = cheerio.load( html );
        let htmlResult = $.html();
        let script = $( container+'script:last' ).html();
        let style = $( container+'style:first' ).html();
        const today = new Date();
        let year = req.body.year ? req.body.year : today.getFullYear();
        
        try {
          // replaceAll 커스텀 for vanilla
          String.prototype.replaceAll = function( org, dest ) {
            return this.split( org ).join( dest );
          }
          // DOMString 경로 변경 후 innerHTML 삽입
          if( req.body.device=="web" ) {
            if( style ) {
              // 캠페인 내부 스타일 이미지 경로 변경
              const bgaddress = 'background:url' || 'background: url';
              style = style.replaceAll(
                bgaddress+'("/images/'+brands+'/'+year+'/event/',
                bgaddress+'("https://kibaeksa.github.io/adidasWeb/front/images/'+brands+'/'+year+'/event/'
              );
            }
            if( script ) {
              // 캠페인 내부 스크립트 이미지 경로 변경
              script= script.replaceAll("'/images/"+brands+"/"+year+"/event/","'https://kibaeksa.github.io/adidasWeb/front/images/"+brands+"/"+year+"/event/");
            }
          }
          if( req.body.device=="mobile" ) {
            if( style ) {
              // 캠페인 내부 스타일 이미지 경로 변경
              var address = 'background:url' || 'background: url';
              style = style.replaceAll(
                address+'("/images/'+brands+'/'+year+'/event/',
                address+'("https://kibaeksa.github.io/adidasMobile/mobile/images/'+brands+'/'+year+'/event/'
              );
            }
            if( script ) {
              // 캠페인 내부 스크립트 이미지 경로 변경
              script= script.replaceAll("'/images/"+brands+"/"+year+"/event/","'https://kibaeksa.github.io/adidasMobile/mobile/images/"+brands+"/"+year+"/event/");
            }
          }

          let result = {"result":"ok", "pn": htmlResult, "script": script, "bg": style };
          res.status(201).json( result );

        } catch ( e ) {
          console.error(e);
        }
      })

    }
  } catch (e) {
    console.error(e);
  }

})
router.post('/addcampaign', async ( req, res, next ) => {
  // console.log(req.body,'123123');
  try {
    const exPost = await db.Addcampaign.findOne({
      where: {
        campaign: req.body.campaign,
      },
    });
    if( exPost ) {
      return res.status(403).send('이미 등록된 캠페인 입니다.');
    }
    const newPost = await db.Addcampaign.create({
      campaign: req.body.campaign,
    });
    res.status(201).json(newPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.post('/list', async ( req, res, next ) => {
  // console.log(req.body,'123123');
  try {
    const listsAll = await db.Addcampaign.findAll({
      //   include: [{
      //   model: db.Addcampaign,
      //   attributes: ['id','userId'],
      // },{
      // order: [['createdAt', 'DESC']],
      // }]
    });
    console.log(listsAll);
    res.json( listsAll );
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const post = await db.Addcampaign.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await db.Addcampaign.destroy({ where: { id: req.params.id } });
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.get('/search/:keyword', async (req, res, next) => {
  try {
    let keyword = req.params.keyword;
    let where = {};
    if( keyword ) {
      where = {
        campaign: {
          [Op.like] : "%"+keyword+"%"
        },
      };
      
    }
    const posts = await db.Addcampaign.findAll({
      where,
      include: [{
        model: db.Search,
      }
    ],
      order: [['createdAt', 'DESC']],
    });
    console.log(posts);
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }


});
// router.get('/download/:file_name', function(req, res, next) {

//   var upload_folder = 'upload/';
//   var file = upload_folder + req.params.file_name; // ex) /upload/files/sample.txt
//   try {
//     if (fs.existsSync(file)) { // 파일이 존재하는지 체크
//       var filename = path.basename(file); // 파일 경로에서 파일명(확장자포함)만 추출
//       var mimetype = mime.getType(file); // 파일의 타입(형식)을 가져옴
//       console.log(file,'111');
      
//       res.setHeader('Content-disposition', 'attachment; filename=' + filename); // 다운받아질 파일명 설정
//       res.setHeader('Content-type', mimetype); // 파일 형식 지정
//       var filestream = fs.createReadStream(file);
      
//       filestream.pipe(res);
//     } else {
//       res.send('해당 파일이 없습니다.');  
//       return;
//     }
//   } catch (e) { // 에러 발생시
//     console.log(e);
//     res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
//     return;
//   }
// });



module.exports = router;