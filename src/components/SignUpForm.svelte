<script lang="ts">
	import { currentUser, pb } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let username = '';
	let email = '';
	let password = '';
	let error = '';

	async function login(email: string, password: string) {
		try {
			await pb.collection('users').authWithPassword(email, password);
			goto('/');
		} catch (err: any) {
			console.error('Login failed:', err);
			error = err.message;
		}
	}

	async function signUp(event: Event) {
		event.preventDefault();
		try {
			error = '';
			const data = {
				username,
				email,
				password,
				passwordConfirm: password,
				emailVisibility: true
			};

			console.log('Signing up with:', { ...data, password: '***' });
			const record = await pb.collection('users').create(data);
			console.log('Signup successful:', record);

			// Login after successful signup
			await login(email, password);
		} catch (err: any) {
			console.error('Signup failed:', err);
			if (err.response?.data?.data) {
				// Handle specific field errors
				const fieldErrors = Object.entries(err.response.data.data)
					.map(([field, errors]) => `${field}: ${errors}`)
					.join(', ');
				error = `Validation failed: ${fieldErrors}`;
			} else {
				error = err.message || 'Failed to create account';
			}
		}
	}

	function logout() {
		pb.authStore.clear();
	}
</script>

<div class="container space-y-4">
	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form on:submit={signUp}>
		<div class="field">
			<label for="username">Username</label>
			<input type="text" id="username" bind:value={username} required minlength="3" />
		</div>

		<div class="field">
			<label for="email">Email</label>
			<input type="email" id="email" bind:value={email} required />
		</div>

		<div class="field">
			<label for="password">Password</label>
			<input type="password" id="password" bind:value={password} required minlength="8" />
		</div>

		<button type="submit">Sign Up</button>
	</form>

	<p class="login-link">Already have an account? <a href="/login">Login</a></p>
</div>

<style>
	.container {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
	}

	.field {
		margin-bottom: 15px;
	}

	label {
		display: block;
		margin-bottom: 5px;
	}

	input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	button {
		width: 100%;
		padding: 10px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-bottom: 10px;
	}

	button:hover {
		background-color: #45a049;
	}

	.error {
		color: red;
		background: #ffebee;
		padding: 10px;
		border-radius: 4px;
		margin-bottom: 15px;
	}

	.user-info {
		text-align: center;
		color: #666;
	}

	.login-link {
		text-align: center;
		margin-top: 20px;
	}

	.login-link a {
		color: #4caf50;
		text-decoration: none;
	}

	.login-link a:hover {
		text-decoration: underline;
	}
</style>
