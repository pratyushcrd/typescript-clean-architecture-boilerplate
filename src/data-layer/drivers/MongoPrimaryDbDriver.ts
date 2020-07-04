import { Container, Config } from '../../types'
import { LifeCycle } from '../../util/LifeCycle'
import { MongoClient, Db, Collection } from 'mongodb';

export interface ActiveMongoPrimaryDriver {
  client: MongoClient;
  db: Db;
  userCollection: Collection;
}

export class MongoPrimaryDbDriver extends LifeCycle {
  private config: Config;

  constructor ({ config }: Container) {
    super();
    this.config = config;
  }

  async start () {
    const config = this.config;
    const mongoPrimaryUrl = config.mongoPrimaryUrl;

    const client = await MongoClient.connect(mongoPrimaryUrl);
    console.log('connected!')
    const db = client.db(config.mongoPrimaryDbName);
    const userCollection = db.collection('users');
    
    // save the db; so its returned in the get call
    this.save({
      client,
      db,
      userCollection,
    });
  }

  get (): ActiveMongoPrimaryDriver { // overriding return type of parent
    return super.get()
  }

  async stop () {
    const activeMongoPrimaryDriver = this.get();
    if (activeMongoPrimaryDriver) {
      await activeMongoPrimaryDriver.client.close();
    }
  }
}