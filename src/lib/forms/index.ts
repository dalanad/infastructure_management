export interface FieldOptions {
	type?: FieldType | string;
	label?: string;
	name?: string;
}

export enum FieldType {
	TEXT = "text",
	HIDDEN = "hidden",
}

export abstract class FormControl {
	protected _name?: string;
	private _id?: string;

	get id() {
		return this.name.replace(/[.]/g, "_");
	}

	type: any = FieldType.TEXT;
	parent?: FormControl;

	set name(value: string) {
		this._name = value;
	}

	get name() {
		return this.parent?.name ? `${this.parent._name}[${this._name}]` : this._name || "";
	}

	_value?: string;

	set value(value: string | undefined) {
		this._value = value;
	}

	get value() {
		return this._value;
	}

	label?: string;

	toObject(): any {
		return {
			id: this.id,
			type: this.type,
			name: this.name,
			value: this.value,
			label: this.label,
		};
	}
}

export class Field extends FormControl {
	constructor(any: FieldOptions) {
		super();
		this.label = any.label;
		this.type = any.type;
		this.name = any.name || "";
	}
}

export class FormArray extends FormControl {
	constructor(fields: Field[]) {
		super();
	}
}

export class Form extends FormControl {
	set value(values: any) {
		Object.keys(this.meta.fields).forEach((key) => {
			this.meta.fields[key].value = values[key];
		});
	}
	get value(): any {
		let value: any = {};
		Object.keys(this.meta.fields).forEach((key) => {
			value[key] = this.meta.fields[key].value;
		});
		return value;
	}

	constructor(
		private meta: {
			title?: string;
			fields: { [key: string]: any };
			parent?: FormControl;
		}
	) {
		super();
		for (const key in meta.fields) {
			if (Object.prototype.hasOwnProperty.call(meta.fields, key)) {
				if (meta.fields[key].toObject == undefined) {
					meta.fields[key] = new Field(meta.fields[key]);
				}
				meta.fields[key].parent = this;
				meta.fields[key].name = key;
			}
		}
		this.parent = meta.parent;
	}
	toObject() {
		const object = {
			type: "form",
			title: this.meta.title,
			fields: Object.keys(this.meta.fields).map((key) => this.meta.fields[key].toObject()),
		};
		return object;
	}
}

function convertObjects(fields: any, parent?: FormControl) {
	if (typeof fields == "object") {
		return fields;
	}

	if (fields.length != undefined) {
		for (let i = 0; i < fields.length; i++) {
			if (fields[i].setParent == undefined) {
				fields[i] = new Field({ ...fields[i], parent: parent });
				fields[i].setParent([], parent);
			}
		}
		return fields;
	}
}
