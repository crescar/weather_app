import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity({
  name: "users"
})
export class UserEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column({
    unique: true
  })
  email: string

  @Column()
  password: string

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

}