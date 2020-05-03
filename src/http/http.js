import axios from 'axios'
import el from "element-ui/src/locale/lang/el";

// http 配置
axios.defaults.timeout = 5000;


// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token1) {
      config.headers.token = localStorage.token1
    }else {
      config.headers.token = "1"
    }
    return config;  //添加这一行
  },
  err => {
    return Promise.reject(err)
  },
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data==="登录状态已过期，请重新登录" || response.data==="登录状态已过期，请重新登录"){
      window.localStorage.clear()
      history.pushState(null,null,"/login")
    }
    return response
  },
  error => {
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 401:
    //       // 401 清除信息并跳转到登录页面
    //       alert("账号或者密码错误");
    //   }
    // }
    // return Promise.reject(error.response.data)
    return Promise.reject(error.response)
  },
);

export default axios
