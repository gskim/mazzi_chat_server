import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

export enum PostStatus {
	공개 = 'public',
	비공개 = 'private',
	삭제 = 'delete',
}

@Entity()
class Post extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number

	@Column({ type: 'text', nullable: false })
	public text: string

	@Column({ type: 'text', enum: PostStatus })
	public status: string

	@CreateDateColumn() public createdAt: string

	@UpdateDateColumn() public updatedAt: string
}
export default Post
