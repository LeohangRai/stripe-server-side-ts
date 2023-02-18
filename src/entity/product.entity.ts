import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'products'
})
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}
