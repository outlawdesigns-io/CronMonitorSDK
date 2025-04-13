"use strict";

const Record = require('@outlawdesigns/db-record');

class Subscription extends Record{

  constructor(id){
    const database = process.env.MYSQL_CRON_DB || 'cron';
    const table = 'event_subscription';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'eventId',
      'recipient',
      'recipient_cc',
      'recipient_bcc',
      'disabled'
    ];
  }
}

module.exports = Subscription;
