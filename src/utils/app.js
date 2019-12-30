import axios from 'axios'
import {Message} from 'element-ui';
import da from "element-ui/src/locale/lang/da";


axios.interceptors.response.use(success => {
    /** 响应成功回调
     * 浏览器状态码不为null且为200,后台响应为500
     *  即浏览器状态码200，后台业务返回错误
     */
    if (success.status && success.status === 200 && success.data.success === false) {
        Message.error({message: success.data.message});
        return;
    }
    if (success.data.message) {
        // 成功信息为ok的不展示
        if (success.data.message !== 'ok') {
            Message.success({message: success.data.message});
        }
    }
    return success.data;


}, error => {
    // 响应失败回调
    if (error.response.status === 504 || error.response.status === 404) {
        Message.error({message: '服务器被绑架了 (๑•̀ㅂ•́)و✧ '});
    } else if (error.response.status === 403) {
        Message.error({message: '权限不足，请联系管理员!'});
    } else if (error.response.status === 401) {
        Message.error({message: '尚未登录，请登录!'});
    } else {
        if (error.data.message) {
            Message.error({message: error.data.message});
        } else {
            Message.error({message: '未知错误！'});
        }
    }

});

let base = '';

export const postKeyValueRequest = (url, param) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: param,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&';
            if (ret.length > 0) ret = ret.substring(0, ret.length - 1);
            return ret;
        }],
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

    })
};

export const postRequest = (url, param) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: param
    })
};
export const deleteRequest = (url, param) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: param
    })
};
export const putRequest = (url, param) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: param
    })
};
export const getRequest = (url, param) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: param
    })
};