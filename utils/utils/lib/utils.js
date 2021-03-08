/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-02-23 20:37:28
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-04 20:44:55
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/utils/utils/lib/utils.js
 */
'use strict';


function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

module.exports = {
    isObject
};

