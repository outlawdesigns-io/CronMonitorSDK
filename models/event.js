"use strict";

const Record = require('@outlawdesigns/db-record');

class Event extends Record{

  constructor(id){
    const database = process.env.MYSQL_CRON_DB || 'cron';
    const table = 'event';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'name'
    ];
  }
}

module.exports = Event;
