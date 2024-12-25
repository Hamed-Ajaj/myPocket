<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	let data = $props();
	let todos = $state(data.data.todos.items);

	const createTodo = async () => {
		try {
			const data = {
				task: 'test',
				completed: false,
				due_to: '',
				priority: '',
				duration: '',
				taskNote: 'test',
				user_todo: $currentUser.id
			};
			const record = await pb.collection('todos').create(data);
			// Add the new todo to the list immediately
			todos = [...todos, record];
		} catch (err) {
			console.error('failed to create todo:', err);
		}
	};

	const updateTodoCompleted = async (id: string, completed: boolean) => {
		try {
			const data = {
				completed: !completed
			};
			const record = await pb.collection('todos').update(id, data);
			// Update the todo in the list immediately
			todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo));
		} catch (err) {
			console.error('failed to update todo:', err);
		}
	};
	console.log($currentUser);
</script>

<main class="flex w-full flex-col items-center py-16">
	<div class="flex h-auto w-[600px] flex-col gap-2 px-5 py-5">
		<h1 class="text-xl font-semibold text-black">Today</h1>
		<p class="flex gap-2 text-sm font-light text-gray-400">
			<CheckCircleSolid color="green" />
			{todos.length} Tasks
		</p>
		<div class="w-full border-b border-gray-200">
			<p class="py-2 text-sm font-medium">All Tasks</p>
		</div>
		<div>
			{#each todos as todo}
				<div class="mb-2 flex h-auto w-[600px] items-center gap-4 border-b border-gray-200 py-3">
					<input
						type="checkbox"
						name="completed"
						class="focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 h-5 w-5 cursor-pointer rounded-full border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
						bind:checked={todo.completed}
						onclick={() => updateTodoCompleted(todo.id, todo.completed)}
					/>
					<h1 class="text-[10px] font-normal text-black">{todo.task}</h1>
				</div>
			{/each}
			<div class="flex items-center gap-2 px-2">
				<button
					onclick={createTodo}
					type="button"
					class="group flex items-center gap-2 bg-transparent text-[10px] font-light"
				>
					<span
						class="h-4 w-4 rounded-full text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white"
						>+</span
					>
					<span class="text-gray-300 transition-all group-hover:text-blue-500">Add Task</span>
				</button>
			</div>
		</div>
	</div>
</main>
