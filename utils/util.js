const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
function chunkArr(arr,size){
  var result = [];
  var l = arr.length; 
  var s = Math.ceil(l/size)
  for(var i =0;i<s;i++){
      result[i] = arr.slice(size*i,size*(i+1))
  }
  return result
}
function checkEmpty(obj,errs){
	let errArr=[]
	for(let key in obj){
		if(!errs[key])continue;
		if(Array.isArray(obj[key])&&!obj[key].length){
			errArr.push(errs[key])
		}else{
			if(!obj[key]&&obj[key]!==0){
				errArr.push(errs[key])
			}
		}
	}
	return errArr;
}
function deleteNull(obj){
  for(let key in obj){
    if(obj[key]==null)delete obj[key];
  }
  return obj
}

module.exports = {
  formatTime,
  chunkArr,
  checkEmpty,
  deleteNull
}
