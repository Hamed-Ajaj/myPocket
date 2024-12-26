<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import {
		CheckCircleSolid,
		ChevronDownOutline,
		FlagOutline,
		FlagSolid
	} from 'flowbite-svelte-icons';
	import type { Todo } from '../../../types/types';
	import { Tooltip } from 'flowbite-svelte';

	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	let data = $props<Todo[]>();
	let taskTitle = $state<string>('');
	let taskDescription = $state<string>('');
	let todos = $state<Todo[]>(data.data.todos.items);
	let addTask = $state<boolean>(false);
	let priority = $state<'hight' | 'normal' | 'low'>('normal');
	$inspect(priority);
	let due_to = $state<Date>(new Date());
	let duration = $state<string>('');
	let dropdownOpen = $state(false);

	const getPriorityColor = (priority: 'hight' | 'normal' | 'low'): string => {
		switch (priority) {
			case 'hight':
				return 'bg-red-200';
			case 'normal':
				return 'bg-yellow-200';
			case 'low':
				return 'bg-green-200';
			default:
				return '';
		}
	};

	const getPriorityBorderColor = (priority: 'hight' | 'normal' | 'low'): string => {
		switch (priority) {
			case 'hight':
				return 'border-red-500';
			case 'normal':
				return 'border-yellow-300';
			case 'low':
				return 'border-green-500';
			default:
				return '';
		}
	};

	const createTodo = async () => {
		try {
			const data = {
				task: taskTitle,
				completed: false,
				due_to: due_to.toISOString() || '',
				priority: priority,
				duration: duration,
				taskNote: taskDescription,
				user_todo: $currentUser?.id
			};
			const record = await pb.collection('todos').create(data);
			// Convert the record to Todo type
			const newTodo: Todo = {
				id: record.id,
				task: record.task,
				completed: record.completed,
				due_to: record.due_to,
				priority: record.priority,
				duration: record.duration,
				taskNote: record.taskNote,
				user_todo: record.user_todo
			};
			taskTitle = '';
			taskDescription = '';
			priority = 'normal';
			due_to = new Date();
			duration = '';
			// Add the new todo to the list immediately
			todos = [...todos, newTodo];
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
			todos = todos?.map((todo) => (todo?.id === id ? { ...todo, completed: !completed } : todo));
		} catch (err) {
			console.error('failed to update todo:', err);
		}
	};
	console.log($currentUser);
</script>

<main class="flex w-full flex-col items-center py-16">
	<div class="mb-2 flex h-auto w-[600px] flex-col gap-2 py-5">
		<div class="jusctify-center flex flex-col gap-2">
			<h1 class="text-xl font-semibold text-black">Today</h1>
			<p class="flex gap-2 text-sm font-light text-gray-400">
				<CheckCircleSolid color="green" />
				{todos.length} Tasks
			</p>
		</div>
		<div class="w-full border-b border-gray-200">
			<p class="py-2 text-sm font-medium">All Tasks</p>
		</div>
		<div>
			{#each todos as todo}
				<div
					class={`mb-2 flex h-auto w-[600px] items-center gap-4 border-b border-gray-200 px-1 py-3`}
				>
					<input
						type="checkbox"
						name="completed"
						class={`focus:ring-3 h-5 w-5 cursor-pointer rounded-full border-2 ${getPriorityBorderColor(todo?.priority)}`}
						bind:checked={todo.completed}
						onclick={() => updateTodoCompleted(todo.id, todo.completed)}
					/>
					<h1 class="text-[10px] font-normal text-black">{todo.task}</h1>
					<p>{Date.now()}</p>
					<!-- <p class="flex gap-2 text-[9px] font-light text-gray-400">
						<FlagSolid
							color={todo?.priority === 'hight'
								? 'red'
								: priority === 'normal'
									? 'orange'
									: 'green'}
						/>
					</p> -->
				</div>
			{/each}
			<div class="flex items-center gap-2">
				{#if !addTask}
					<button
						onclick={() => {
							addTask = true;
						}}
						type="button"
						class="group flex items-center gap-2 bg-transparent text-[10px] font-light"
					>
						<span
							class="h-4 w-4 rounded-full text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white"
							>+</span
						>
						<span class="text-gray-300 transition-all group-hover:text-blue-500">Add Task</span>
					</button>
				{/if}
				{#if addTask}
					<div class="h-auto w-full">
						<form
							class="flex min-h-[100px] w-full flex-col gap-3 rounded-xl border border-gray-600 bg-gray-100 p-4"
						>
							<div class="flex flex-col gap-2">
								<input
									type="text"
									name="task-title"
									id="task-title"
									placeholder="Task Title"
									bind:value={taskTitle}
									class="w-full border-none bg-transparent p-0 text-[12px] font-medium text-gray-900 outline-none placeholder:text-[12px] focus:ring-0"
								/>
								<input
									type="text"
									name="task-description"
									id="task-description"
									placeholder="Description"
									bind:value={taskDescription}
									class="w-full border-none bg-transparent p-0 text-[9px] font-normal text-gray-900 outline-none placeholder:text-[9px] focus:ring-0"
								/>
							</div>
							<div class="flex w-full items-center gap-2 border-b border-gray-200 py-4">
								<div>
									<div>
										<button
											type="button"
											class={`flex h-6 w-16 items-center justify-center gap-2 rounded ${getPriorityColor(priority)} py-1 text-[9px] font-medium text-gray-800 ring-0 hover:opacity-80 focus:ring-0`}
											onclick={() => (dropdownOpen = !dropdownOpen)}
										>
											{priority}
										</button>
										<Tooltip class="p-2 text-[8px]">Set Priority</Tooltip>
									</div>

									<Dropdown open={dropdownOpen}>
										<DropdownItem
											class="flex items-center gap-2  px-2 py-[1px] text-[10px]"
											onclick={() => {
												priority = 'hight';
												dropdownOpen = false;
											}}><FlagSolid color="red" /> Hight</DropdownItem
										>
										<DropdownItem
											class="flex items-center gap-2  px-2 py-[1px] text-[10px]"
											onclick={() => {
												priority = 'normal';
												dropdownOpen = false;
											}}><FlagSolid color="yellow" /> Normal</DropdownItem
										>
										<DropdownItem
											class="flex items-center gap-2  px-2 py-[1px] text-[10px]"
											onclick={() => {
												priority = 'low';
												dropdownOpen = false;
											}}><FlagSolid color="green" /> Low</DropdownItem
										>
									</Dropdown>
								</div>
								<div>
									<input
										type="date"
										name="due-date"
										class="flex h-6 items-center gap-2 rounded border-none bg-white text-[9px] font-medium text-gray-800 outline-none ring-0 hover:bg-gray-100 focus:ring-0"
									/>
									<Tooltip class="p-2 text-[8px]">Set Due Date</Tooltip>
								</div>
							</div>
							<div class="flex w-full items-center justify-end gap-4">
								<button
									class="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white"
									onclick={createTodo}>Add Task</button
								>
								<button
									class="rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white"
									onclick={() => (addTask = false)}>Cancel</button
								>
							</div>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>
