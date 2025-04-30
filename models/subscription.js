"use strict";

const Record = require('@outlawdesigns/db-record');

class Subscription extends Record{

  static table = 'event_subscription';
  static primaryKey = 'id';
  static get database(){
    return process.env.MYSQL_CRON_DB || 'cron';
  }

  constructor(id){
    super(Subscription.database,Subscription.table,Subscription.primaryKey,id);
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
