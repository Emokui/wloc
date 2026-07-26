/* wloc-settings.js - Surge only - 2026-07-26 */
const STORE_KEY="emokui_wloc_settings_v1";

function decodeQueryPart(value){
  try{return decodeURIComponent(String(value).replace(/\+/g," "))}
  catch{return String(value)}
}

function parseQuery(url){
  const query=String(url||"").split("?")[1]||"";
  const params=new Map();
  for(const part of query.split("&")){
    if(!part)continue;
    const separator=part.indexOf("=");
    const rawKey=separator<0?part:part.slice(0,separator);
    const rawValue=separator<0?"":part.slice(separator+1);
    const key=decodeQueryPart(rawKey);
    if(!params.has(key))params.set(key,decodeQueryPart(rawValue));
  }
  return params;
}

function parseArguments(value){
  if(value&&typeof value==="object")return value;
  const params=parseQuery("?"+String(value||"").replace(/^\?/,""));
  return Object.fromEntries(params);
}

function readSettings(){
  const raw=$persistentStore.read(STORE_KEY);
  if(!raw)return null;
  try{
    const value=JSON.parse(raw);
    return value&&typeof value==="object"?value:null;
  }catch{
    return null;
  }
}

function writeSettings(value){
  const serialized=value===null?null:JSON.stringify(value);
  return $persistentStore.write(serialized,STORE_KEY);
}

function isValidCoordinate(longitude,latitude){
  return Number.isFinite(longitude)&&
    Number.isFinite(latitude)&&
    longitude>=-180&&longitude<=180&&
    latitude>=-90&&latitude<=90;
}

const params=parseQuery($request.url);
const moduleArgs=parseArguments(globalThis.$argument);
const action=params.get("action")||"save";
let result;

try{
  if(action==="query"){
    const saved=readSettings();
    const savedLongitude=Number(saved?.longitude);
    const savedLatitude=Number(saved?.latitude);
    const moduleLongitude=Number(moduleArgs.longitude);
    const moduleLatitude=Number(moduleArgs.latitude);
    const hasSaved=isValidCoordinate(savedLongitude,savedLatitude);
    const hasModuleDefault=isValidCoordinate(moduleLongitude,moduleLatitude);

    if(hasSaved||hasModuleDefault){
      const longitude=hasSaved?savedLongitude:moduleLongitude;
      const latitude=hasSaved?savedLatitude:moduleLatitude;
      const requestedAccuracy=Number.parseInt(
        hasSaved?saved.accuracy:moduleArgs.accuracy,
        10
      );
      result={
        success:true,
        longitude,
        latitude,
        accuracy:Number.isFinite(requestedAccuracy)&&requestedAccuracy>0?requestedAccuracy:25,
        updatedAt:hasSaved?(saved.updatedAt||null):null,
        source:hasSaved?"saved":"module"
      };
    }else{
      result={success:false,error:"模块未设置有效坐标"};
    }
  }else if(action==="clear"){
    result=writeSettings(null)
      ?{success:true}
      :{success:false,error:"清除失败"};
  }else{
    const longitude=Number(params.get("lon")??params.get("longitude"));
    const latitude=Number(params.get("lat")??params.get("latitude"));
    const requestedAccuracy=Number.parseInt(params.get("acc")??params.get("accuracy")??"25",10);
    const accuracy=Number.isFinite(requestedAccuracy)&&requestedAccuracy>0?requestedAccuracy:25;

    if(!isValidCoordinate(longitude,latitude)){
      result={success:false,error:"缺少或无效的 lon/lat 参数"};
    }else{
      const saved={
        longitude,
        latitude,
        accuracy,
        updatedAt:new Date().toISOString()
      };
      result=writeSettings(saved)
        ?{success:true,longitude,latitude,accuracy}
        :{success:false,error:"写入失败"};
    }
  }
}catch(error){
  result={success:false,error:error&&error.message?error.message:"操作失败"};
}

$done({
  response:{
    status:200,
    headers:{
      "Content-Type":"application/json",
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"GET, OPTIONS"
    },
    body:JSON.stringify(result)
  }
});
