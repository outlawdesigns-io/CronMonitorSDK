"use strict";

const { CronExpressionParser } = require('cron-parser');
const Record = require('@outlawdesigns/db-record');
const CronTemplate = require('../cronTemplate');
const Execution = require('./execution');

class Job extends Record{

  static table = 'job';
  static primaryKey = 'id';
  static get database(){
    return process.env.MYSQL_CRON_DB || 'cron';
  }

  constructor(id){
    super(Job.database,Job.table,Job.primaryKey,id);
    this.publicKeys = [
      'id',
      'title',
      'description',
      'hostname',
      'user',
      'cronTime',
      'friendlyTime',
      'cmdToExec',
      'container',
      'imgName',
      'outfile',
      'shell',
      'pathVariable',
      'tz_code',
      'cronWrapperPath',
      'created_date',
      'disabled'
    ];
  }
  getExecutionInterval(){
    try{
      let interval = CronExpressionParser.parse(this.cronTime);
      return interval;
    }catch(err){
      throw err;
    }
  }
  static async getByHost(hostname, isImg = false){
    return new Promise((resolve,reject)=>{
      let colName = isImg ? "imgName":"hostname";
      let db = this.getDb().table(this.table).select(this.primaryKey).where(`${colName} = ?`,[hostname]);
      if(!isImg){
        db.andWhere("!container");
      }
      db.execute().then( async (data)=>{
        let ret = [];
        for(let i = 0; i < data.length; i++){
          let job = await new this(data[i][this.primaryKey]).init();
          ret.push(job.getPublicProperties());
        }
        resolve(ret);
      }).catch(reject);
    });
  }
  static recordExists(targetId){
    return new Promise((resolve,reject)=>{
      this.getDb().table(this.table).select(this.primaryKey).where(`${this.primaryKey} = ?`,[targetId]).execute().then((data)=>{
        if(!data.length){
          resolve(false);
        }
        resolve(true);
      }).catch(reject);
    });
  }
  static getPatternInterval(patternStr){
    try{
      let interval = CronExpressionParser.parse(patternStr);
      return interval;
    }catch(err){
      throw err;
    }
  }
  static async buildCronFile(hostname,isImg = false){
    let templateStr = CronTemplate.headerText;
    let jobs = await Job.getByHost(hostname,isImg);
    if(!jobs.length){
      return '';
    }
    if(jobs[0].tz_code){
      templateStr += `TZ=${jobs[0].tz_code}\n`;
    }
    if(jobs[0].shell){
      templateStr += `SHELL=${jobs[0].shell}\n`;
    }
    if(jobs[0].pathVariable){
      templateStr += `PATH=${jobs[0].pathVariable}\n`;
    }
    templateStr = jobs.reduce((acc,e)=>{
      let wrapperPath = (e.cronWrapperPath ? e.cronWrapperPath:CronTemplate.cronWrapperDefaultPath) + CronTemplate.cronWrapperDefaultScript;
      return acc += `${e.cronTime} ${wrapperPath} ${e.id} "${e.cmdToExec}" "${e.outfile}"\n`;
    },templateStr);
    return templateStr;
  }
}

module.exports = Job;
