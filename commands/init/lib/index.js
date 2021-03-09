/*
 * @message: 描述
 * @Author: Roy
 * @Email: @163.com
 * @Github: @163.com
 * @Date: 2021-03-04 15:53:52
 * @LastEditors: Roy
 * @LastEditTime: 2021-03-10 00:14:04
 * @Deprecated: 否
 * @FilePath: /roy-cli-dev/commands/init/lib/index.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const userHome = require('user-home');
const inquirer = require('inquirer');
const semver = require('semver');
const Command = require('@roy-cli-dev/command');
const log = require('@roy-cli-dev/log');
const Package = require('@roy-cli-dev/package');
const {spinnerStart,sleep} = require('@roy-cli-dev/utils');

const getProjectTemplate = require('./getProjectTemplate')

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = this._cmd.force;
        log.verbose(this._argv);
        log.verbose('projectName',this.projectName);
        log.verbose('force',this.force);
    }
    async exec() {
        try {
            //1.准备阶段
            const projectInfo = await this.prepare();
            if (projectInfo) {
                //2.下载模板
                log.verbose('projectInfo',projectInfo);
                this.projectInfo = projectInfo
                await this.downloadTemplate();
                 //3.安装模板
            }
        } catch (e) {
            log.error(e.message);
        }
    }

    async downloadTemplate() {
        //1. 通过项目模板API获取项目模板信息
        //1.1 通过egg.js搭建一套后端系统
        //1.2 通过npm存储项目模板
        //1.3 将项目模板信息存储到mongodb数据库中
        //1.4 通过egg.js获取mongodb中的数据并且通过API返回
        const { projectTemplate } = this.projectInfo;
        const templateInfo = this.template.find(item => item.npmName === projectTemplate);
        const targetPath = path.resolve(userHome,'.roy-cli-dev','template');
        const storeDir = path.resolve(userHome,'.roy-cli-dev','template','node_modules');
        const {npmName,version} = templateInfo;
        const templateNpm = new Package({
            targetPath,
            storeDir,
            packageName:npmName,
            packageVersion:version
        })
        if (! await templateNpm.exists()) {
            const spinner = spinnerStart('正在下载模板...');
            await sleep();
            try {
                await templateNpm.install();
                log.success('下载模板成功');
            } catch (e) {
                throw e;                
            } finally {
                spinner.stop(true);
            }
        } else {
            const spinner = spinnerStart('正在更新模板...');
            await sleep();
            try {
                await templateNpm.update();
                log.success('更新模板成功');
            } catch (e) {
                throw e;                
            } finally {
                spinner.stop(true);
            }
        }
    }


    async prepare() {
        // 判断项目模板是否存在
        const template = await getProjectTemplate();
        if (!template || template.length === 0) {
            throw new Error('项目模板不存在');
        }
        this.template = template;
        //1.判断当前目录是否为空
        const localPath = process.cwd();
        if (!this.isDirEmpty(localPath)) {
            let ifContinue = false;
            if (!this.force) {
                //询问是否继续创建
                ifContinue = (await inquirer.prompt({
                    type:'confirm',
                    name:'ifContinue',
                    default:false,
                    message:'当前文件夹不为空，是否继续创建项目?'
                })).ifContinue;
                if (!ifContinue) {
                    return ;
                }
            }
            //2.是否启动强制更新
            if (ifContinue || this.force) {
                //给用户二次确认
                const {confirmDelete} = await inquirer.prompt({
                    type:'confirm',
                    name:'confirmDelete',
                    default:false,
                    message:'是否确认清空当前目录下的文件?',
                })
                if (confirmDelete) {
                    //清空当前目录
                    fse.emptyDirSync(localPath)
                }
            }
            return this.getProjectInfo();
        }
        
        //3.选择创建项目或组件
        //4.获取项目得基本信息

    }
    async getProjectInfo() {
        let projectInfo = {};
        //1.选择创建项目或组件
        const {type} = await inquirer.prompt({
            type:'list',
            name:'type',
            message:'请选择初始化类型',
            default:TYPE_PROJECT,
            choices:[{
                name:'项目',
                value:TYPE_PROJECT
            },{
                name:'组件',
                value:TYPE_COMPONENT
            }]
        });
        log.verbose('type',type);
        if (type === TYPE_PROJECT) {
            //2.获取项目的基本信息
            const project = await inquirer.prompt([{
                type:'input',
                name:'projectName',
                message:'请输入项目的名称',
                default:'',
                validate:function(v) {
                    const done = this.async();
                    setTimeout(function() {
                        //1.输入的首字符必须为英文字符
                        //2.尾字符必须为英文或数字，不能为字符
                        //3.字符仅运行"-_"
                        //\w = a-zA-Z0-9  *表示可有可无
                        if (!/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)) {
                            done('请输入合法的项目名称');
                            return;
                        }
                        done(null,true);
                    }, 0);
                },
                filter:function(v) {
                    return v;
                }
            },{
                input:'input',
                name:'projectVersion',
                message:'请输入项目版本号',
                default:'1.0.0',
                validate:function(v) {
                    const done = this.async();
                    setTimeout(function() {
                        //1.输入的首字符必须为英文字符
                        //2.尾字符必须为英文或数字，不能为字符
                        //3.字符仅运行"-_"
                        //\w = a-zA-Z0-9  *表示可有可无
                        if (!(!!semver.valid(v))) {
                            done('请输入合法的版本号');
                            return;
                        }
                        done(null,true);
                    }, 0);
                },
                filter:function(v) {
                    if (!!semver.valid(v)) {
                        return semver.valid(v);
                    } else {
                        return v;
                    }
                }
            },{
                type:'list',
                name:'projectTemplate',
                message:'请选择项目模板',
                choices:this.createTemplateChoices()
            }]);
            projectInfo = {
                type,
                ...project
            }
        } else if (type === TYPE_COMPONENT) {
            
        }
        //return 项目的基本信息(object)
        return projectInfo;
    }
    
    isDirEmpty(localPath) {
        let fileList = fs.readdirSync(localPath);
        //文件过滤的逻辑
        fileList = fileList.filter(file => (
            !file.startsWith('.')&&['node_modules'].indexOf(file)<0
        ));

        return !fileList||fileList.length<=0;
    }
    createTemplateChoices(){
        return this.template.map(item => ({
            value: item.npmName,
            name:item.name
        }))
    }
}

function init(argv) {
    // console.log('init',projectName,cmdObj.force,process.env.CLI_TARGET_PATH);
    return new InitCommand(argv);
}


module.exports = init;
module.exports.InitCommand = InitCommand;
