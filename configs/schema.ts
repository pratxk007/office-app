import { boolean } from "drizzle-orm/pg-core";
import { pgTable, serial, varchar, json } from "drizzle-orm/pg-core";


export const Users = pgTable('users',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull().unique(),
    imageUrl:varchar('imageUrl'),
    subscription:boolean('subscription').default(false)
})


export const VideoData = pgTable('videoData',{
    id:serial('id').primaryKey(),
    script:json('script').notNull(),
    audioFileUrl:varchar('audioFileUrl').notNull(),
    captions:json('captions').notNull(),
    imageList:varchar('ImageList').array(),
    createdBy:varchar('createdBy').notNull()

})