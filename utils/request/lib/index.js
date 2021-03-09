/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-03-09 22:33:06
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-09 23:19:50
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/utils/request/lib/index.js
 */
'use strict';

// const axios = require('axios');

// const BASE_URL = process.env.ROY_CLI_BASE_URL ?  process.env.ROY_CLI_BASE_URL : "https://www.baidu.com";

// const request = axios.create({
//     baseURL:BASE_URL,
//     timeout:5000
// });

// request.interceptors.response.use(
//     response => {
//         // return response.data;
//         return [{
//             name:'vue3标准模板',
//             npmName:'roy-cli-dev-template',
//             version:'1.0.0'
//         }]
//     },
//     error => {
//         return Promise.reject(error);
//     }
// )

const request = function () {
    return [{
        name: 'vue3标准模板',
        npmName: 'roy-cli-dev-template',
        version: '1.0.0'
    },{
        name: 'vue2管理后台模板',
        npmName: 'roy-cli-dev-template-vue-element-admin',
        version: '1.0.0'
    }]
}

module.exports = request;

