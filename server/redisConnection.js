const Redis = require('ioredis');
const redisClient =new Redis({
  host: 'localhost', 
  port: 6379,        
});
const set=async(key,value)=>{
  await redisClient.set(key,value,'EX',60*60*6);
}
const get=async(key)=>{
  const result=await redisClient.get(key);
  return result;
}

const del=async(key)=>{
  await redisClient.del(key);
}

module.exports={get,set,del};
