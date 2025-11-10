# CronMonitor SDK (Server-Side)

A lightweight Node.js SDK for interacting with the **CronMonitor Service** at the data layer.  
This package provides ORM-style access to CronMonitor database models through a consistent, class-based interface built on [`@outlawdesigns/db-record`](https://www.npmjs.com/package/@outlawdesigns/db-record).

---

## 🚀 Features

- 🗃️ **Model-based access** — Interact with CronMonitor data via predefined models (`Job`, `Execution`, `Event`, `Subscription`).
- 🧩 **Extensible factory pattern** — Dynamically fetch models or their classes using a centralized `ModelFactory`.
- ⚙️ **Database abstraction** — Built on `@outlawdesigns/db-record`, enabling easy MySQL integration.
- 🕒 **Cron utilities** — Uses [`cron-parser`](https://www.npmjs.com/package/cron-parser) for cron schedule parsing and manipulation.

---

## 📦 Installation

```bash
npm install @outlawdesigns/cronmonitorsdk
```

---

## 🧠 Basic Usage

### Require the SDK

```js
const CronMonitor = require('@outlawdesigns/cronmonitorsdk');
```

### Create a Model Instance

You can create a model instance dynamically by name:

```js
const job = CronMonitor.get('job', 1);
await job.load();
console.log(job.name);
```

### Access Model Classes Directly

If you need to instantiate or extend a model class manually:

```js
const Job = CronMonitor.getClass('job');
const myJob = new Job(2);
await myJob.load();
```

---

## 🧩 Available Models

| Model | Description | Backing Table |
|:-------|:-------------|:--------------|
| `job` | Represents a monitored cron job. | `job` |
| `execution` | Tracks individual job execution logs. | `execution` |
| `event` | Represents system or job events. | `event` |
| `subscription` | Defines webhook subscriptions for job events. | `subscription` |

All models extend `@outlawdesigns/db-record.Record` and provide standard CRUD operations.

---

## 🔧 Example: Working with Events

```js
const CronMonitor = require('@outlawdesigns/cronmonitorsdk');

const event = CronMonitor.get('event', 5);
await event.load();

console.log({
  id: event.id,
  name: event.name
});
```

Each model exposes a `publicKeys` array defining which fields are safe for external consumption.

---

## ⚙️ Environment Variables

| Variable | Description | Default |
|-----------|-------------|----------|
| `MYSQL_CRON_DB` | Database name for CronMonitor models. | `cron` |

---

## 🧱 Project Structure

```
.
├── cronTemplate.js        # Optional helper for cron schedule handling
├── index.js               # SDK entry point
├── modelFactory.js        # Central model registry
├── models/
│   ├── job.js
│   ├── execution.js
│   ├── event.js
│   └── subscription.js
└── package.json
```

---

## 🧩 Extending the SDK

To add your own model:

1. Create a new file under `models/`, extending `@outlawdesigns/db-record.Record`.
2. Register it in `modelFactory.js` under both `models` and `modelClasses` maps.

Example:

```js
class Alert extends Record {
  static table = 'alert';
  static primaryKey = 'id';
  static get database() { return process.env.MYSQL_CRON_DB || 'cron'; }
}
```

Then register it:

```js
const Alert = require('./models/alert');
models.alert = (id) => new Alert(id);
modelClasses.alert = Alert;
```

---

## 🧾 License

This project is licensed under the [ISC License](./LICENSE).

---

## 👤 Author

Maintained by **Outlaw Designs**  
[https://github.com/outlawdesigns-io](https://github.com/outlawdesigns-io)
