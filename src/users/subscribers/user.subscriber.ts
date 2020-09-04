import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "../entities/user.entity";


@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {

    
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo() {
        return User;
    }
    
    /**
     * Called before  user insertion.
     */
    async beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE USER INSERTED: `, event.entity);
        event.entity.password = await this.hashPassword(event.entity.password);
        console.log('AFTER HASH PASSWORD',  event.entity);

    }

    async afterInsert(event: InsertEvent<User>) {
      console.log(`BEFORE USER INSERTED: `, event.entity);
      event.entity.password = await this.hashPassword(event.entity.password);
      console.log('AFTER HASH PASSWORD',  event.entity);

  }

    async hashPassword(password: string) {
      return await bcrypt.hash(password, 10);
    }

}