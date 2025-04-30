"use strict";

const Record = require('@outlawdesigns/db-record');

class Execution extends Record{

  static table = 'execution';
  static primaryKey = 'id';
  static get database(){
    return process.env.MYSQL_CRON_DB || 'cron';
  }

  constructor(id){
    super(Execution.database,Execution.table,Execution.primaryKey,id);
    this.publicKeys = [
      'id',
      'jobId',
      'startTime',
      'endTime',
      'output'
    ];
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
  translateDates(){
    this.startTime = this.db.date(this.startTime);
    this.endTime = this.db.date(this.endTime);
  }
  static async getLast(jobId){
    return new Promise((resolve,reject)=>{
      this.getDb().table(this.table).select(this.primaryKey).where("jobId = ?",[jobId]).orderBy("endTime desc limit 1").execute().then(async (data)=>{
        if(data.length){
          let exec = await new this(data[0][this.primaryKey]).init();
          resolve(exec.getPublicProperties());
        }
        reject({error:"No Execution History"})
      }).catch(reject);
    });
  }
  static async getAverageExecutionTime(jobId){
    try{
      let data = await this.getDb().table(this.table).select('avg(TIME_TO_SEC(TIMEDIFF(endTime,startTime))) as avg_execution_seconds').where('jobId = ?', [jobId]).execute();
      return data[0]['avg_execution_seconds'];
    }catch(err){
      // console.log(err);
      throw err;
    }
  }
  static async deleteJobHistory(jobId){
    try{
      return this.getDb().table(this.table).delete().where('jobId = ?',[jobId]).execute();
    }catch(err){
      throw err;
    }
  }
}

module.exports = Execution;
