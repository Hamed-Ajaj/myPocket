<script>
	import { goto } from '$app/navigation';
	import { currentUser, pb } from '$lib/pocketbase';
	if ($currentUser) {
		goto('/todos');
	}
</script>

{#if !$currentUser}
	<main class="flex h-screen flex-col items-center justify-center bg-gray-200">
		<h1 class="text-2xl font-bold text-gray-800 md:text-4xl">Welcome to myPocket</h1>
		<p class="mt-4 text-center text-base text-gray-600 md:text-lg">
			Your one-step solution for managing your tasks and goals.
		</p>
		<div class="mt-8 flex space-x-4 text-center">
			<a
				href="/sign-up"
				class="flex min-w-[100px] items-center justify-center rounded-md border border-gray-800 bg-white px-4 py-2 text-gray-800 transition-all hover:bg-gray-100"
			>
				Sign Up
			</a>
			<a
				href="/login"
				class="flex min-w-[100px] items-center justify-center rounded-md border border-gray-800 bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-600"
			>
				Login
			</a>
		</div>
	</main>
{/if}
