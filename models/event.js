"use strict";

const Record = require('@outlawdesigns/db-record');

class Event extends Record{
  static table = 'event';
  static primaryKey = 'id';
  static get database(){
    return process.env.MYSQL_CRON_DB || 'cron';
  }

  constructor(id){
    super(Event.database,Event.table,Event.primaryKey,id);
    this.publicKeys = [
      'id',
      'name'
    ];
  }
}

module.exports = Event;
