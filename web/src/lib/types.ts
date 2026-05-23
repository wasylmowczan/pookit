import type { RecordModel } from 'pocketbase';

export interface User extends RecordModel {
	id: string;
	username: string;
	email: string;
	name?: string;
	avatar?: string;
}
