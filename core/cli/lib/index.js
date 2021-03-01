/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-02-23 20:34:11
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-01 10:17:39
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/core/cli/lib/index.js
 */
'use strict';

module.exports = core;

const path = require('path');
const semver = require('semver');
const log = require('@roy-cli-dev/log');
const colors = require('colors');
const userHome = require('user-home');//获取当前用户主目录
const pathExists = require('path-exists').sync;//判断目录是否存在

const pkg = require('../package.json');
const constants = require('./const');

let args;

async function core() {
    try {
        checkPkgVersion();
        checkNodeVersion();
        checkRoot();
        checkUserHome();
        checkInputArgs();
        checkEnv();
        await checkGlobalUpdate();
    } catch (e) {
        log.error(e.message);
    }
}

// 检查是否是最新版本，是否需要更新
async function checkGlobalUpdate() {
    //1.获取当前版本号和模块名
    const currentVersion = pkg.version;
    const npmName = pkg.name;
    //2.调用npm API,获取所有版本号
    const {getNpmSemverVersion} = require('@roy-cli-dev/get-npm-info');
    //3.提取所有版本号，比对哪些版本号是大于当前版本号
    const lastVersion = await getNpmSemverVersion(currentVersion,npmName);
    if (lastVersion && semver.gt(lastVersion,currentVersion)) {
    //4.获取最新的版本号，提示用户更新到该版本
        log.warn(colors.yellow(`请手动更新${npmName},当前版本:${currentVersion},最新版本:${lastVersion} 
                    更新命令:npm install -g ${npmName}`))
    }
}

// 检查环境变量
function checkEnv() {
    const dotenv = require('dotenv');
    const dotenvPath = path.resolve(userHome,'.env');
    if (pathExists(dotenvPath)) {
        config = dotenv.config({
            path:dotenvPath
        });
    } 
    createDefaultConfig();
    log.verbose('环境变量',process.env.CLI_HOME_PATH);
}

function createDefaultConfig(){
    const cliConfig = {
        home:userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome,process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome,constants.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

// 检查入参
function checkInputArgs(){
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs();
}

function checkArgs(){
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose';
    } else {
        process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
}
// 检查用户主目录
function checkUserHome(){
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在!!!'));
    }
}
// 检查root启动
function checkRoot() {
    //使用后，检查到root账户启动，会进行降级为用户账户
    const rootCheck = require('root-check');
    rootCheck();
}
// 检查node版本
function checkNodeVersion() {
    //第一步，获取当前Node版本号
    const currentVersion = process.version;
    const lastVersion = constants.LOWEST_NODE_VERSION;
    //第二步，对比最低版本号
    if (!semver.gte(currentVersion, lastVersion)) {
        throw new Error(colors.red(`roy-cli-dev 需要安装v${lastVersion}以上版本的Node.js`));
    }
}

// 检查版本
function checkPkgVersion(){
    log.info('cli',pkg.version);
}


