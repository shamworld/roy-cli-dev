/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-02-23 20:37:28
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-10 00:04:34
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/utils/utils/lib/utils.js
 */
'use strict';


function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function spinnerStart(msg,spinnerString = '|/-\\') {
    const Spinner = require('cli-spinner').Spinner;
    const spinner = new Spinner(msg + ' %s');
    spinner.setSpinnerString(spinnerString);
    spinner.start();
    return spinner;
}

function sleep(timeout = 1000) {
    return new Promise((resolve, reject) => setTimeout(resolve,timeout));

}

module.exports = {
    isObject,
    spinnerStart,
    sleep
};

