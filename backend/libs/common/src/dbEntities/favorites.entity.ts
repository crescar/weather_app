import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity({
  name: "favorites"
})
export class FavoritesEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: "user_id"})
  userId:number

  @Column({name: "city_id"})
  cityId: number

  @Column()
  city:string

  @Column()
  country: string 

  @Column()
  region: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;


}