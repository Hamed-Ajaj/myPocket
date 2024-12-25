<script lang="ts">
	let { children } = $props();
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ChartPieSolid,
		GridSolid,
		MailBoxSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		EditOutline,
		CalendarWeekSolid,
		CalendarMonthSolid,
		CheckCircleOutline
	} from 'flowbite-svelte-icons';
	let spanClass = 'flex-1 ms-3 whitespace-nowrap';
	let sidebarOpen = $state<Boolean>(true);
	// activeUrl = $derived(page.url.pathname);
</script>

<div class="flex w-full">
	<Sidebar ariaLabel="Sidebar" class={` h-screen w-1/4 dark:bg-gray-800`}>
		<SidebarWrapper class="h-full overflow-y-auto py-5">
			<SidebarGroup>
				<SidebarItem label="Today" href="/today">
					<svelte:fragment slot="icon">
						<CalendarWeekSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
					<svelte:fragment slot="subtext">
						<span
							class="text-primary-600 bg-primary-200 dark:bg-primary-900 dark:text-primary-200 ms-3 inline-flex h-3 w-3 items-center justify-center rounded-full p-3 text-sm font-medium"
						>
							3
						</span>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Upcoming" href="/upcoming">
					<svelte:fragment slot="icon">
						<CalendarMonthSolid
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="All Todos" href="/todos">
					<svelte:fragment slot="icon">
						<CheckCircleOutline
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
				<SidebarItem label="Sign Up">
					<svelte:fragment slot="icon">
						<EditOutline
							class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						/>
					</svelte:fragment>
				</SidebarItem>
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	{@render children()}
</div>
