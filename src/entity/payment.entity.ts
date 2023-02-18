import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";
import { UserEntity } from "./user.entity";

@Entity({
    name: 'payments'
})
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Generated('uuid')
    _id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ referencedColumnName: 'id', name: 'userId' })
    user?: UserEntity;

    @ManyToOne(type => ProductEntity)
    @JoinColumn({ referencedColumnName: 'id', name: 'productId' })
    product: ProductEntity;

    @Column()
    amount: number
}