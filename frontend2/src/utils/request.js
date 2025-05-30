import axios from 'axios'
import qs from 'qs'
import cookie from 'js-cookie'
import { message } from 'antd'
const apiUrl = import.meta.env.VITE_API_BASE_URL;


const instance = axios.create({
    baseURL: apiUrl,
    timeout: 300000
})

instance.interceptors.request.use(function (config) {
    // 登录时就已经把token存到了cookie中
    const token = cookie.get("token");
    if (token) {
        config.headers.authorization = token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    if (error && error.response) {
        message.destroy();
        switch (error.response.status) {
            case 400:
                message.error('错误请求');
                break;
            case 401:
                message.info({
                    content: "登录过期，请重新登录",
                    type: "info",
                    duration: 3,
                    maxCount: 1,
                    onClose: () => {
                        cookie.remove("userInfo");
                        window.location.href = '/login';
                    }
                })
                break;
            case 403:
                message.info("拒绝访问");
                break;
            case 404:
                message.info("请求错误，未找到资源");
                break;
            case 405:
                message.info("请求方法未允许");
                break;
            case 408:
                message.info("请求超时");
                break;
            case 500:
                message.info("服务端出错");
                break;
            case 501:
                message.info("网络未实现");
                break;
            case 502:
                message.info("网络错误");
                break;
            case 503:
                message.info("服务不可用");
                break;
            case 504:
                message.info("网络超时");
                break;
            case 505:
                message.info("http版本不支持该请求");
                break;
            default:
                message.info(`连接错误${error.response.status}`);
        }
    }
    return Promise.reject(error);
});

const _post = (api, data, headers = {}) => {
    return new Promise((resolve, reject) => {
        instance.post(api, data, { headers })
            .then(res => { resolve(res) })
            .catch(error => { reject(error) })
    })
}

const post = (api, data, headers = {}) => {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return _post(api, qs.stringify(data), headers)
}

const postJson = (api, data, headers = {}) => {
    headers['Content-Type'] = 'application/json;charset=utf-8'
    return _post(api, JSON.stringify(data), headers)
}

const postFormData = (api, data, headers = {}) => {
    headers['Content-Type'] = 'multipart/form-data'
    return _post(api, data, headers)
}

const get = (api, params = {}, headers = {}) => {
    return new Promise((resolve, reject) => {
        instance.get(api, { params, headers })
            .then(res => {
                resolve(res)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// 导出，供各页面调用
export default { post, postJson, postFormData, get };