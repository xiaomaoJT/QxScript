// hostname引号内放入所有主机名，并以 “,” 隔开
let hostname = "";



let arr = hostname.replace(/\s*/g, "").split(",");
console.log(
  "%c" + "原主机名" + "数据量",
  "color:red;font-weight:bolder",
  arr.length + "条"
);
let deal_arr = Array.from(new Set(arr));
console.log(
  "%c" + "处理后的主机名" + "数据量",
  "color:green;font-weight:bolder",
  deal_arr.length + "条"
);
console.log(deal_arr.toString());
