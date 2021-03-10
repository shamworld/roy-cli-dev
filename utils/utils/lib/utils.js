/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-02-23 20:37:28
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-10 15:28:50
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/utils/utils/lib/utils.js
 */
'use strict';

const cp = require('child_process');

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

function exec(command, args, options){
    const win32 = process.platform === 'win32';

    const cmd = win32 ? 'cmd' : command;
    const cmdArgs = win32 ? ['/c'].concat(command,args) : args;

    return cp.spawn(cmd, cmdArgs,options || {});
}

function execAsync(command, args, options){
    return new Promise((resolve, reject) => {
        const p = exec(command, args, options);
        p.on('err', e => {
            reject(e);
        });
        p.on('exit', c => {
            resolve(c);
        });
    })
}


module.exports = {
    isObject,
    spinnerStart,
    sleep,
    exec,
    execAsync
};

