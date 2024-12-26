<script lang="ts">
	let { children } = $props();
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		EditOutline,
		CalendarWeekSolid,
		CalendarMonthSolid,
		CheckCircleOutline,
		InboxFullOutline,
		CheckCircleSolid
	} from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	console.log($page.url.pathname);
	// activeUrl = $derived(page.url.pathname);
</script>

<div class="flex w-full">
	<Sidebar ariaLabel="Sidebar" class={` min-h-screen min-w-[250px] max-w-[250px] dark:bg-gray-800`}>
		<SidebarWrapper class="h-full overflow-y-auto py-5">
			<SidebarGroup>
				<SidebarItem
					label="Today"
					href="/today"
					class={`${$page.url.pathname === '/today' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
				>
					<svelte:fragment slot="icon">
						<CalendarWeekSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-primary-200 p-3 text-sm font-medium text-primary-600 dark:bg-primary-900 dark:text-primary-200"
						>
							3
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Upcoming"
					href="/upcoming"
					class={`${$page.url.pathname === '/upcoming' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
				>
					<svelte:fragment slot="icon">
						<CalendarMonthSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="All Todos"
					href="/todos"
					class={`${$page.url.pathname === '/todos' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
				>
					<svelte:fragment slot="icon">
						<InboxFullOutline
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem
					label="Completed"
					href="/completed"
					class={`${$page.url.pathname === '/completed' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
				>
					<svelte:fragment slot="icon">
						<CheckCircleSolid
							color="#22c55e"
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	{@render children()}
</div>
