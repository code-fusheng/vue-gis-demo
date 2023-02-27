import{_ as Z,r as M,b as S,o as L,c as C,d as i,w as h,n as q,F as I,f as x,u as K,e as v,t as g,a as P,q as O,k as $,p as Q,g as ee}from"./index-13ed24c7.js";import{S as c,F as f,e as _,T as N,C as te,cy as ae,cz as re,V as W,M as J,b as y,d as m,G as k,k as se,h as b,j as oe,P as E,cs as V}from"./Select-73cfa6a9.js";import{C as le}from"./Cluster-5304c38e.js";import"./index-820b305b.js";const ie=[{label:"EPSG:3857(大坐标)",value:"EPSG:3857",state:!0},{label:"EPSG:4326(小坐标)",value:"EPSG:4326",state:!0},{label:"EPSG:4490(中国大地2000)",value:"EPSG:4490",state:!1}],z={"HTC-轮廓":[new c({fill:new f({color:"#838485"}),stroke:new _({color:"#838485",width:1.5})})],"HTC-停车位":[new c({fill:new f({color:"#0fa27d"}),stroke:new _({color:"#988a8a",width:.5})})],"HTC-残疾人网格":[new c({fill:new f({color:"#FFAC5E"}),stroke:new _({color:"#FFAC5E",width:.5})})],"HTC-车位号":[new c({text:new N({font:"bold 3px Arial",fill:new f({color:"#485759"}),text:"",textAlign:"center"})})],"HTC-文字":[new c({text:new N({font:"bold 12px Arial",fill:new f({color:"#879294"}),text:"",textAlign:"center"})})],"HTC-标识":[new c({image:new te({radius:5,fill:new f({color:"rgba(255, 255, 255, 0.4)"}),stroke:new _({color:"#3399CC",width:.5})}),fill:new f({color:"rgba(255, 255, 255, 0.4)"}),stroke:new _({color:"#3399CC",width:.5})})]},ne=function(a,t){const e=a.get("features").length,s=a.get("features")[e-1],l=JSON.parse(s.values_.properties).Text;return new c({text:new N({font:"bold 11px Arial",fill:new f({color:"#485759"}),text:l})})},R=function(a,t){var{Text:e,Layer:s}=JSON.parse(a.values_.properties);if(a.getGeometry().getType(),e&&s!="HTC-车位号"){var l=z[s]||[new c({fill:ae,stroke:re})];return l[0].getText().setText(e),l}else if(e&&s=="HTC-车位号"){var l=z[s];return l[0].getText().setText(e),l}return z[s]};const he=a=>(Q("data-v-85a731e5"),a=a(),ee(),a),pe=he(()=>P("br",null,null,-1)),de={class:"map-box"},j=M("B3"),X=M("mark"),Y=M("查询机"),B=M("A2-001"),H=M(""),G=M(""),U=M("EPSG:4326"),ue=[{key:"车位编号",value:"text"},{key:"查询机",value:"mark"}],ye={data(){return{key:"",mapInfoList:[],currentMapInfoList:[],currentMapInfo:null,targetMapInfo:null,startToEnd:[],map1:"",view1:"",map2:"",view2:"",tileLayer:"",vectorLayer:"",parkLayer:"",markLayer:"",roadLayer:"",textLayer:"",shortestRoadLayer:"",startLayer:"",endLayer:"",carLayer:"",carStyleLayer:"",clusterSource:"",showMarkSwitch:!1,showRoadSwitch:!1,showTextSwitch:!1,checkRoadSwitch:!1,showCarSwitch:!1,showSelectTipSwitch:!1,showHoverTipSwitch:!1,showDoubleSwitch:!1,carSelect:"",map1Style:{widht:"width: 50%",height:"700px"},map2Style:{widht:"width: 50%",height:"700px"},park2Layer:""}},methods:{printMapInfo(){console.table({坐标系:this.view2.getProjection().getCode(),深度:this.view2.getZoom(),分辨率:this.view2.getResolution(),图层数:this.map2.getLayers().getLength()}),console.log(this.view2)},initView(){this.view1=new W({projection:"EPSG:4326",center:[0,0],zoom:1,interactions:[]})},initView2(){this.view2=new W({projection:"EPSG:4326",center:[0,0],zoom:1,interactions:[]})},initMap(){this.map1=new J({target:"map1",controls:[],layers:[],view:this.view1})},initMap2(){this.map2=new J({target:"map2",controls:[],layers:[],view:this.view1})},listMap(){var a={layerType:"base"};q.post("http://42.192.222.62:10010/mapinfo/page",a).then(t=>{console.log(t.data),this.mapInfoList=t.data.data})},doDoubleMap(){if(this.initMap2(),this.showDoubleSwitch=!this.showDoubleSwitch,this.showDoubleSwitch){var a=(document.body.clientWidth-150)/2,t=document.body.clientHeight-50;this.map1Style.widht=a,this.map1Style.height=t,this.map2Style.widht=a,this.map2Style.height=t}else{var a=document.body.clientWidth-150,t=document.body.clientHeight-50;this.map1Style.widht=a,this.map1Style.height=t,this.map2Style.widht=0,this.map2Style.height=0}},doLoadDoubleMap(){var a;if(this.currentMapInfoList.length>0){a=this.currentMapInfoList.filter(w=>w.layer_level==j.value)[0];var{layer_name:t,extent:e,center:s}=a,l=t.toLowerCase();this.initMap2(),this.initView2(),this.parkLayer2=new y({source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${l}&outputFormat=application/json&srsname=EPSG:4326`}),style:R}),this.map2.addLayer(this.parkLayer2);var o=e.replace(/[()]/g,"").split(","),n=parseFloat(o[0]),p=parseFloat(o[2]),u=parseFloat(o[1]),d=parseFloat(o[3]);this.view1.fit([n,p,u,d]),this.map2.render()}},resetMap(){this.map1.removeLayer(this.shortestRoadLayer),this.map1.removeLayer(this.startLayer),this.map1.removeLayer(this.endLayer),this.map1.removeLayer(this.carLayer),this.map1.removeLayer(this.carStyleLayer),this.map1.removeLayer(this.roadLayer),this.map1.removeLayer(this.markLayer),this.map1.removeLayer(this.parkLayer),this.map1.removeLayer(this.textLayer),this.showMarkSwitch=!1,this.showRoadSwitch=!1,this.checkRoadSwitch=!1,this.showMarkSwitch=!1,this.showSelectTipSwitch=!1,this.showHoverTipSwitch=!1},changeMap(a){this.resetMap(),console.log(a),this.currentMapInfoList=this.mapInfoList.filter(T=>T.park_name==a),console.log(this.currentMapInfoList);var t=G.value||this.currentMapInfoList[0].layer_level;this.currentMapInfo=this.currentMapInfoList.filter(T=>T.layer_level==t)[0],this.currentMapInfo=this.currentMapInfoList[0],H.value=a,G.value=this.currentMapInfo.layer_level,console.table(this.currentMapInfo);var{layer_name:e,extent:s,center:l}=this.currentMapInfo,o=e.toLowerCase();this.parkLayer=new y({source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${o}&outputFormat=application/json&srsname=EPSG:4326`}),style:R}),this.map1.addLayer(this.parkLayer);var n=l.replace(/[{}]/g,"").split(",");console.log(n);var p=s.replace(/[()]/g,"").split(","),u=parseFloat(p[0]),d=parseFloat(p[2]),w=parseFloat(p[1]),r=parseFloat(p[3]);if(this.view1.fit([u,d,w,r]),this.showDoubleSwitch){this.targetMapInfo=this.currentMapInfoList.filter(T=>T.layer_level==j.value)[0];var F=this.targetMapInfo.layer_name.toLowerCase();this.parkLayer2=new y({source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${F}&outputFormat=application/json&srsname=EPSG:4326`}),style:R}),this.map2.addLayer(this.parkLayer2)}},changeLevel(a){this.resetMap(),this.map1.removeLayer(this.parkLayer),console.log(a),this.currentMapInfo=this.mapInfoList.filter(r=>r.layer_name==a)[0],console.table(this.currentMapInfo);var{layer_name:t,extent:e,center:s}=this.currentMapInfo,l=t.toLowerCase();this.parkLayer=new y({source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${l}&outputFormat=application/json&srsname=EPSG:4326`}),style:R}),this.map1.addLayer(this.parkLayer);var o=s.replace(/[{}]/g,"").split(",");this.view1.setCenter([o[0],o[1]]);var n=e.replace(/[()]/g,"").split(","),p=parseFloat(n[0]),u=parseFloat(n[2]),d=parseFloat(n[1]),w=parseFloat(n[3]);this.view1.fit([p,u,d,w]),this.map1.render()},changeCoordinateType(){},doLoadMark(){if(this.showMarkSwitch=!this.showMarkSwitch,this.showMarkSwitch){var{layer_key:a,layer_level:t,layer_name:e,extent:s,center:l}=this.currentMapInfo,o=(a+"_"+t+"_mark").toLowerCase();this.markLayer=new y({source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${o}&outputFormat=application/json&srsname=EPSG:4326`}),style:R}),this.map1.addLayer(this.markLayer),console.log(this.markLayer.getStyle())}else this.map1.removeLayer(this.markLayer)},doShowText(){if(this.showTextSwitch=!this.showTextSwitch,this.showTextSwitch){var{layer_key:a,layer_level:t,layer_name:e,extent:s,center:l}=this.currentMapInfo,o=(a+"_"+t+"_text").toLowerCase();this.clusterSource=new le({distance:50,source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${o}&outputFormat=application/json&srsname=EPSG:4326`})}),this.textLayer=new y({source:this.clusterSource,style:ne}),this.map1.addLayer(this.textLayer)}else this.map1.removeLayer(this.textLayer)},doLoadRoad(){if(this.showRoadSwitch=!this.showRoadSwitch,this.showRoadSwitch){var{layer_key:a,layer_level:t,layer_name:e,extent:s,center:l}=this.currentMapInfo,o=(a+"_"+t+"_road").toLowerCase();this.roadLayer=new y({source:new m({format:new k,url:`http://42.192.222.62:8080/geoserver/wfs?version=1.1.0&request=GetFeature&typeName=park_map:${o}&outputFormat=application/json&srsname=EPSG:4326`})}),this.map1.addLayer(this.roadLayer)}else this.map1.removeLayer(this.roadLayer)},doLoadCarStyle(){if(console.log("doLoadCarStyle"),this.showCarSwitch=!this.showCarSwitch,this.showCarSwitch){this.carStyleLayer=new y({source:new m});var a=this.parkLayer.getSource().getFeatures();a.forEach(t=>{var{Text:e,Layer:s}=JSON.parse(t.values_.properties);if(s==="HTC-停车位"){var l=t.getGeometry().getCoordinates(),o=new se([l]),n=new b({geometry:o});n.setStyle(z[s]),this.carStyleLayer.getSource().addFeature(n)}}),this.map1.addLayer(this.carStyleLayer)}else this.map1.removeLayer(this.carStyleLayer)},doHoverShowTip(){if(this.showHoverTipSwitch=!this.showHoverTipSwitch,this.showHoverTipSwitch){var a=t=>{};this.map1.on("pointermove",a)}},doSelectShowTip(){if(this.showSelectTipSwitch=!this.showSelectTipSwitch,this.showSelectTipSwitch){const t=new c({stroke:new _({color:"red",width:.5}),text:new N({font:"bold 5px Arial",fill:new f({color:"#485759"}),text:"",textAlign:"center",rotation:-Math.PI/2})});this.carSelect=new oe({style:t,pixelTolerance:50}),this.map1.addInteraction(this.carSelect);var a=e=>{var s=e.selected[0];console.log(s),s.setStyle(t)};this.carSelect.on("select",a)}else this.carSelect.un("select",a)},doCheckStartToEnd(){if(this.checkRoadSwitch=!this.checkRoadSwitch,this.checkRoadSwitch){var a=t=>{var e=t.coordinate;this.startToEnd.push(e);var s=new b({geometry:new E(e)});s.setStyle(new c({image:new V({src:"../定位.png",anchor:[.5,1]})})),this.startToEnd.length==1?(this.startLayer=new y({source:new m}),this.startLayer.getSource().addFeature(s),this.map1.addLayer(this.startLayer)):this.startToEnd.length==2?(this.endLayer=new y({source:new m}),this.endLayer.getSource().addFeature(s),this.map1.addLayer(this.endLayer)):(this.startToEnd=[],this.map1.removeLayer(this.shortestRoadLayer),this.map1.removeLayer(this.startLayer),this.map1.removeLayer(this.endLayer),this.map1.removeLayer(this.carLayer),this.startLayer="",this.endLayer="")};this.map1.on("singleclick",a)}else this.map1.un("singleclick",a),this.startToEnd=[],this.map1.removeLayer(this.shortestRoadLayer),this.map1.removeLayer(this.startLayer),this.map1.removeLayer(this.endLayer),this.map1.removeLayer(this.carLayer),this.startLayer="",this.endLayer=""},doLoadShortestRoad(){var{layer_key:a,layer_level:t,layer_name:e,extent:s,center:l}=this.currentMapInfo;console.log(this.startToEnd);var o=this.startToEnd[0],n=this.startToEnd[1],p=["x1:"+o[0],"y1:"+o[1],"x2:"+n[0],"y2:"+n[1],"layer_name:"+((a+"_"+t+"_road").toLowerCase()||"bj_hx_live_wks_0223_b2_road")];const u={version:"1.1.0",request:"GetFeature",typeName:"park_map:load_road_shortest_v2",outputFormat:"application/json",srsname:"EPSG:4326",viewparams:p.join(";")};var d=new URLSearchParams(u).toString();console.log(d),this.shortestRoadLayer=new y({source:new m({format:new k,url:"http://42.192.222.62:8080/geoserver/wfs?"+d}),style:new c({fill:new f({color:"#ff0000"}),stroke:new _({color:"#ff0000",width:4})})}),this.map1.addLayer(this.shortestRoadLayer),this.map1.render()},async doLoadCarRoad(){var a=[];await q.post(`http://42.192.222.62:10010/slotinfo?layer_level=${this.currentMapInfo.layer_level}&layer_key=${this.currentMapInfo.layer_key}&slot_num=${B.value}`).then(e=>{console.log(e.data),a=e.data.data}).catch(function(e){console.log(e),alert("未找到")}),this.carLayer=new y({source:new m});var t=new b({geometry:new E(a)});t.setStyle(new c({image:new V({src:"../定位.png",anchor:[0,0]})})),this.carLayer.getSource().addFeature(t),this.map1.addLayer(this.carLayer),this.map1.render(),this.startToEnd.push(a)},async doLocationFeature(a,t){a=a||Y.value,t=t||X.value;var e=[];if(await q.post(`http://42.192.222.62:10010/feature/location?layer_level=${this.currentMapInfo.layer_level}&layer_key=${this.currentMapInfo.layer_key}&layer_type=${t}&pres_text=${a}`).then(l=>{console.log(l.data),e=l.data.data}).catch(function(l){alert("未找到")}),this.startToEnd.length==0){this.startLayer=new y({source:new m});var s=new b({geometry:new E(e)});s.setStyle(new c({image:new V({src:"../定位.png",anchor:[0,0]})})),this.startLayer.getSource().addFeature(s),this.map1.addLayer(this.startLayer)}else{this.endLayer=new y({source:new m});var s=new b({geometry:new E(e)});s.setStyle(new c({image:new V({src:"../定位.png",anchor:[0,0]})})),this.endLayer.getSource().addFeature(s),this.map1.addLayer(this.endLayer)}this.map1.render(),this.startToEnd.push(e),console.log(this.startToEnd)},doTestRandomStart(){var{layer_key:a,layer_level:t,layer_name:e,extent:s,center:d}=this.currentMapInfo;console.log(s);var l=s.replace(/[()]/g,"").split(","),o=parseFloat(l[0]),n=parseFloat(l[2]),p=parseFloat(l[1]),u=parseFloat(l[3]),d=[parseFloat((Math.random()*(p-o)+o).toFixed(12)),parseFloat((Math.random()*(u-n)+n).toFixed(12))];console.log(d),this.startToEnd.push(d);var w=new b({geometry:new E(d)});w.setStyle(new c({image:new V({src:"../定位.png",anchor:[.5,1]})})),this.startLayer=new y({source:new m}),this.startLayer.getSource().addFeature(w),this.map1.addLayer(this.startLayer),this.map1.render()},doFastLoadCarRoad(){this.listMap(),this.showCarSwitch=!1,this.showMarkSwitch=!1,this.showTextSwitch=!1,this.startToEnd=[],this.map1.removeLayer(this.shortestRoadLayer),this.map1.removeLayer(this.startLayer),this.map1.removeLayer(this.endLayer),this.map1.removeLayer(this.carLayer),this.map1.removeLayer(this.carStyleLayer),this.map1.removeLayer(this.parkLayer),this.map1.removeLayer(this.markLayer),console.log(this.currentMapInfoList),console.log(this.currentMapInfo),console.log(this.mapInfoList);var{park_name:a,layer_key:t,layer_level:e,layer_name:s,extent:l,center:o}=this.currentMapInfo||this.mapInfoList[0];console.log(a,t),this.changeMap(a);var n=!1;this.map1.on("rendercomplete",p=>{if(!n){this.doLoadCarStyle(),n=!n;var u=!1;this.map1.on("rendercomplete",d=>{if(!u){this.doLoadMark(),u=!u;var w=!1;this.map1.on("rendercomplete",r=>{if(!w){this.doShowText(),w=!w;var F=!1;this.map1.on("rendercomplete",T=>{if(!F){this.doLocationFeature(),F=!F;var D=!1;this.map1.on("rendercomplete",ce=>{if(!D){this.doLoadCarRoad(),D=!D;var A=!1;this.map1.on("rendercomplete",we=>{A||(this.doLoadShortestRoad(),A=!A)})}})}})}})}})}})}},mounted(){this.listMap(),this.initView(),this.initMap();var a=document.body.clientWidth-150,t=document.body.clientHeight-50;this.map1Style.widht=a,this.map1Style.height=t,this.map2Style.widht=0,this.map2Style.height=0,window.onresize=()=>(()=>{if(this.showDoubleSwitch){var e=(document.body.clientWidth-150)/2,s=document.body.clientHeight-50;this.map1Style.widht=e,this.map1Style.height=s,this.map2Style.widht=e,this.map2Style.height=s}else{var e=document.body.clientWidth-150,s=document.body.clientHeight-50;this.map1Style.widht=e,this.map1Style.height=s,this.map2Style.widht=0,this.map2Style.height=s}})()}},me=Object.assign(ye,{__name:"index-pro",setup(a){return(t,e)=>{const s=S("el-option"),l=S("el-select"),o=S("el-button"),n=S("el-tag"),p=S("el-input"),u=S("a-layout-header"),d=S("a-layout-content"),w=S("a-layout");return L(),C("div",null,[i(w,null,{default:h(()=>[i(u,null,{default:h(()=>[i(l,{style:{width:"120px"},onChange:e[0]||(e[0]=r=>t.changeCoordinateType(U.value)),modelValue:U.value,"onUpdate:modelValue":e[1]||(e[1]=r=>U.value=r),placeholder:"Select",size:"small"},{default:h(()=>[(L(!0),C(I,null,x(K(ie),r=>(L(),$(s,{key:r.value,label:r.label,value:r.value,disabled:!r.state},null,8,["label","value","disabled"]))),128))]),_:1},8,["modelValue"]),i(l,{modelValue:H.value,"onUpdate:modelValue":e[2]||(e[2]=r=>H.value=r),placeholder:"请选择车场地图",size:"small",onChange:e[3]||(e[3]=r=>t.changeMap(H.value))},{default:h(()=>[(L(!0),C(I,null,x(t.mapInfoList,r=>(L(),$(s,{key:r.layer_name,label:r.park_name,value:r.park_name},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),i(l,{style:{width:"100px"},modelValue:G.value,"onUpdate:modelValue":e[4]||(e[4]=r=>G.value=r),placeholder:"请选择楼层",size:"small",onChange:e[5]||(e[5]=r=>t.changeLevel(G.value)),disabled:t.currentMapInfoList.length==0},{default:h(()=>[(L(!0),C(I,null,x(t.currentMapInfoList,r=>(L(),$(s,{key:r.layer_name,label:r.layer_level,value:r.layer_name},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"]),i(o,{size:"small",onClick:e[6]||(e[6]=r=>t.printMapInfo())},{default:h(()=>[v("调试")]),_:1}),i(o,{size:"small",onClick:e[7]||(e[7]=r=>t.resetMap())},{default:h(()=>[v("重置")]),_:1}),i(o,{size:"small",onClick:e[8]||(e[8]=r=>t.doLoadMark())},{default:h(()=>[v(g(t.showMarkSwitch?"隐藏标注":"显示标注"),1)]),_:1}),i(o,{size:"small",onClick:e[9]||(e[9]=r=>t.doShowText())},{default:h(()=>[v(g(t.showTextSwitch?"隐藏文字":"显示文字"),1)]),_:1}),i(o,{size:"small",onClick:e[10]||(e[10]=r=>t.doLoadRoad())},{default:h(()=>[v(g(t.showRoadSwitch?"隐藏道路":"显示道路"),1)]),_:1}),i(o,{size:"small",onClick:e[11]||(e[11]=r=>t.doLoadCarStyle())},{default:h(()=>[v(g(t.showCarSwitch?"隐藏车位渲染":"显示车位渲染"),1)]),_:1}),i(o,{size:"small",onClick:e[12]||(e[12]=r=>t.doSelectShowTip())},{default:h(()=>[v(g(t.showSelectTipSwitch?"关闭选中提示":"开启选中提示"),1)]),_:1}),i(o,{size:"small",onClick:e[13]||(e[13]=r=>t.doHoverShowTip())},{default:h(()=>[v(g(t.showHoverTipSwitch?"关闭悬浮提示":"开启悬浮提示"),1)]),_:1}),i(o,{size:"small",onClick:e[14]||(e[14]=r=>t.doCheckStartToEnd())},{default:h(()=>[v(g(t.checkRoadSwitch?"关闭选点":"开启选点"),1)]),_:1}),pe,i(o,{size:"small",onClick:e[15]||(e[15]=r=>t.doDoubleMap())},{default:h(()=>[v(g(t.showDoubleSwitch?"关闭双地图":"开启双地图"),1)]),_:1}),i(n,null,{default:h(()=>[v(" 起点 ")]),_:1}),i(l,{style:{width:"100px"},modelValue:X.value,"onUpdate:modelValue":e[16]||(e[16]=r=>X.value=r),placeholder:"请选择特征类型",size:"small"},{default:h(()=>[(L(),C(I,null,x(ue,r=>i(s,{key:r.key,label:r.key,value:r.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"]),i(p,{placeholder:"请输入特征Text",size:"small",style:{width:"100px"},modelValue:Y.value,"onUpdate:modelValue":e[17]||(e[17]=r=>Y.value=r)},null,8,["modelValue"]),i(n,null,{default:h(()=>[v(" 终点 ")]),_:1}),i(l,{style:{width:"100px"},modelValue:j.value,"onUpdate:modelValue":e[18]||(e[18]=r=>j.value=r),placeholder:"请选择目标楼层",size:"small"},{default:h(()=>[(L(!0),C(I,null,x(t.currentMapInfoList,r=>(L(),$(s,{key:r.layer_name,label:r.layer_level,value:r.layer_name},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),i(p,{placeholder:"请输入车位编号",size:"small",style:{width:"100px"},modelValue:B.value,"onUpdate:modelValue":e[19]||(e[19]=r=>B.value=r)},null,8,["modelValue"]),i(o,{size:"small",onClick:e[20]||(e[20]=r=>t.doLoadCarRoad())},{default:h(()=>[v("导航 ")]),_:1}),i(o,{size:"small",onClick:e[21]||(e[21]=r=>t.doFastLoadCarRoad())},{default:h(()=>[v(" 一键导航(模拟) ")]),_:1})]),_:1}),i(d,null,{default:h(()=>[P("div",de,[P("div",{id:"map1",style:O("width:"+t.map1Style.widht+"px;height:"+t.map1Style.height+"px;"),tabindex:"0",class:"map1"},null,4),P("div",{id:"map2",style:O("width:"+t.map2Style.widht+"px;height:"+t.map2Style.height+"px;"),tabindex:"1",class:"map2"},null,4)])]),_:1})]),_:1})])}}}),ge=Z(me,[["__scopeId","data-v-85a731e5"]]);export{ge as default};
