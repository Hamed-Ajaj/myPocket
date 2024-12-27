<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import {
		CheckCircleSolid,
		EditOutline,
		EditSolid,
		FlagSolid,
		TrashBinSolid
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
	const date = new Date();

	const getPriorityColor = (priority: 'hight' | 'normal' | 'low'): string => {
		switch (priority) {
			case 'hight':
				return 'bg-red-200';
			case 'normal':
				return 'bg-blue-200';
			case 'low':
				return 'bg-green-200';
			default:
				return '';
		}
	};

	const getPriorityIcon = (priority: 'hight' | 'normal' | 'low'): string => {
		switch (priority) {
			case 'hight':
				return 'red';
			case 'normal':
				return 'blue';
			case 'low':
				return 'green';
			default:
				return '';
		}
	};
	const getPriorityBorderColor = (priority: 'hight' | 'normal' | 'low'): string => {
		switch (priority) {
			case 'hight':
				return 'border-red-500';
			case 'normal':
				return 'border-blue-300';
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
				due_to: due_to,
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
	const deleteTodo = async (id: string) => {
		try {
			await pb.collection('todos').delete(id);
			// Remove the todo from the list immediately
			todos = todos?.filter((todo) => todo?.id !== id);
		} catch (err) {
			console.error('failed to delete todo:', err);
		}
	};
	const getDayName = (due_date_day: number) => {
		const daysOfWeek = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		const daysOfWeekMap = {
			Sun: 'Sunday',
			Mon: 'Monday',
			Tue: 'Tuesday',
			Wed: 'Wednesday',
			Thu: 'Thursday',
			Fri: 'Friday',
			Sat: 'Saturday'
		};
		console.log(new Date().getDate());
		console.log(due_date_day);
		if (new Date().getDate() === due_date_day) {
			return 'Today';
		} else {
			return due_date_day.toString();
		}
	};
	const isDisabled = () => {
		if (taskTitle.length < 3) {
			return true;
		}
		return false;
	};
	console.log($currentUser);
	console.log(due_to.getDate());
	// console.log(due_to.getDay());
</script>

<main class="flex w-full flex-col items-center py-16">
	<div class=" g flex h-auto w-[600px] flex-col py-6">
		<div class="jusctify-center flex flex-col gap-3">
			<h1 class="text-xl font-semibold text-black">Today</h1>
			<p class="flex gap-2 text-sm font-light text-gray-400">
				<CheckCircleSolid color="green" />
				{todos.length} Tasks
			</p>
		</div>
		<div class="mt-2 w-full border-b border-gray-200">
			<p class="py-2 text-sm font-medium">All Tasks</p>
		</div>
		<div>
			{#each todos as todo}
				<div
					class={` flex h-auto w-full items-center justify-between gap-4 border-b border-gray-200 px-2 py-4 hover:bg-gray-100`}
				>
					<div class="flex items-center gap-3">
						<p class="flex gap-2 text-[9px] font-light text-gray-400">
							<FlagSolid color={getPriorityIcon(todo?.priority)} />
						</p>
						<input
							type="checkbox"
							name="completed"
							class={`focus:ring-3 h-4 w-4 cursor-pointer rounded-full border-2 ${getPriorityBorderColor(todo?.priority)}`}
							bind:checked={todo.completed}
							onclick={() => updateTodoCompleted(todo.id, todo.completed)}
						/>
						<div class="flex flex-col gap-1">
							<h1 class="text-[12px] font-normal text-black">{todo.task}</h1>
							<p class="text-[8px]">{getDayName(new Date(todo.due_to).getDate())}</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-2">
							<EditOutline
								size="sm"
								class="cursor-pointer text-gray-500 hover:text-gray-400 focus:ring-0"
							/>
							<Tooltip class="p-1 text-[8px]">Edit Task</Tooltip>
						</div>
						<div class="flex items-center gap-2">
							<TrashBinSolid
								onclick={() => deleteTodo(todo.id)}
								size="sm"
								class="cursor-pointer text-red-500 hover:text-red-400 focus:ring-0"
							/>
							<Tooltip class="p-1 text-[8px]">Delete Task</Tooltip>
						</div>
					</div>
				</div>
			{/each}
			<div class="mt-2 flex items-center gap-2">
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
											}}><FlagSolid color="blue" /> Normal</DropdownItem
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
										bind:value={due_to}
									/>
									<Tooltip class="p-2 text-[8px]">Set Due Date</Tooltip>
								</div>
							</div>
							<div class="flex w-full items-center justify-end gap-4">
								<button
									class="rounded-md bg-blue-500 {isDisabled()
										? 'cursor-not-allowed opacity-50'
										: 'bg-blue-500'} px-4 py-2 text-sm font-medium text-white"
									onclick={createTodo}
									type="button"
									disabled={isDisabled()}>Add Task</button
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
