import { EntitySchema } from "typeorm"

export const TodoEntity = new EntitySchema({
	name: "Todo",
	tableName: "todos",
	columns: {
		id: {
			type: "int",
			primary: true,
			generated: true,
		},
		title: {
			type: "varchar",
			length: 150,
			nullable: false,
		},
		description: {
			type: "text",
			nullable: true,
		},
		isCompleted: {
			type: "boolean",
			default: false,
		},
		createdAt: {
			type: "timestamp",
			createDate: true,
		},
		updatedAt: {
			type: "timestamp",
			updateDate: true,
		},
	},
	relations: {
		assignedTo: {
			type: "many-to-one",
			target: "User",
			joinColumn: {
				name: "assigned_to_id",
			},
			nullable: false,
			onDelete: "CASCADE",
		},
		createdBy: {
			type: "many-to-one",
			target: "User",
			joinColumn: {
				name: "created_by_id",
			},
			nullable: false,
			onDelete: "CASCADE",
		},
	},
})
