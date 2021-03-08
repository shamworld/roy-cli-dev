/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-03-04 15:53:52
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-08 11:03:15
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/commands/init/lib/index.js
 */
'use strict';

const Command = require('@roy-cli-dev/command');
const log = require('@roy-cli-dev/log');

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = this._cmd.force;
        console.log(this._argv);
        log.verbose('projectName',this.projectName);
        log.verbose('force',this.force);
    }
    exec() {
        console.log('init得业务逻辑');
    }
}

function init(argv) {
    // console.log('init',projectName,cmdObj.force,process.env.CLI_TARGET_PATH);
    return new InitCommand(argv);
}


module.exports = init;
module.exports.InitCommand = InitCommand;
