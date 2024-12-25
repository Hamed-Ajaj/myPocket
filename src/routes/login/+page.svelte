<script>
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

    async function loginWithGoogle() {
        try {
            // Use authWithOAuth2 directly inside the click event
            const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });

            // Handle post-login logic, e.g., redirect
            console.log('Login successful:', authData);
            goto('/');
        } catch (err) {
            console.error('OAuth login failed:', err);
        }
    }
</script>

<form>
    <button type="button" on:click={loginWithGoogle}>Login with Google</button>
    <p>Don't have an account? <a href="/sign-up">Sign Up</a></p>
</form>
