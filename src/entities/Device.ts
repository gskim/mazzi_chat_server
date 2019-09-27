import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import User from './User'

@Entity()
class Device extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number

	@Column({ type: 'boolean' })
	public isDevice: boolean

	@Column({ type: 'varchar', length: 20, nullable: true })
	public brand: string | null

	@Column({ type: 'varchar', length: 20, nullable: true })
	public manufacturer: string | null

	@Column({ type: 'varchar', length: 20, nullable: true })
	public modelName: string | null

	// IOS only
	@Column({ type: 'varchar', length: 20, nullable: true })
	public modelId: string | null

	// AND only
	@Column({ type: 'varchar', length: 20, nullable: true })
	public designName: string | null

	// AND only
	@Column({ type: 'varchar', length: 20, nullable: true })
	public productName: string | null

	@Column({ type: 'varchar', length: 20, nullable: true })
	public deviceYearClass: string | null

	@Column({ type: 'varchar', length: 50, nullable: true })
	public supportedCpuArchitectures: string | null

	@Column({ type: 'varchar', length: 20, nullable: false })
	public osName: string

	@Column({ type: 'varchar', length: 20, nullable: false })
	public osVersion: string

	@Column({ type: 'varchar', length: 20, nullable: true })
	public osBuildId: string | null

	@Column({ type: 'varchar', length: 20, nullable: true })
	public osInternalBuildId: string | null

	// AND only
	@Column({ type: 'varchar', length: 300, nullable: true })
	public osBuildFingerprint: string | null

	// AND only
	@Column({ type: 'int', nullable: true })
	public platformApiLevel: number | null

	@Column({ type: 'varchar', length: 100,  nullable: true })
	public deviceName: string | null

	@CreateDateColumn()
	public createdAt: Date

	@UpdateDateColumn()
	public updatedAt: Date

	@ManyToOne((type) => User)
	public user: User

}

export default Device
