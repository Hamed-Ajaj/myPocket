import type { PageServerLoad } from './$types';
import { pb } from '$lib/pocketbase';
export const load: PageServerLoad = async () => {
	const record = await pb.collection('todos').getList();
	console.log(record);

	return {
		todos: record
	};
};
