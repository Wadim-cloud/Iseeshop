<script>
    import { goto, invalidateAll } from '$app/navigation';
    import { derived, writable } from 'svelte/store';
    import AuthModal from '$lib/AuthModal.svelte';

    export let session;
    export let onAuthToggle;

    const sessionStore = writable(session);
    $: sessionStore.set(session);

    let showAuthModal = false;

    function handleSignInClick() {
        console.log('Sign In button clicked, setting showAuthModal to true');
        showAuthModal = true;
        console.log('showAuthModal state:', showAuthModal);
    }

    const gridCols = 10;
    const gridRows = 5;

    function createBlocks() {
        return Array(50).fill(null).map((_, i) => ({
            id: i,
            isBlack: false,
            isBlue: false,
            isRed: false,
            navigateTo: null
        }));
    }

    let blocks1 = createBlocks();
    let blocks2 = createBlocks();
    let blocks3 = createBlocks();

    let blackBlocks1 = [];
    let blackBlocks2 = [];
    let blackBlocks3 = [];

    const user = derived(sessionStore, $session => $session?.user || null);
    const avatarUrl = derived(user, $user => $user?.user_metadata?.avatar_url || '/default-avatar.png');
    const displayName = derived(user, $user => $user?.user_metadata?.full_name || $user?.email?.split('@')[0] || 'User');

    // Notify unauthenticated users when they attempt to access protected routes
    function notifyLoginRequired() {
        alert('Please log in to access this feature.');
        handleSignInClick(); // Optionally open the AuthModal
    }

    function handleMouseMove(event, blocks, setBlocks) {
        const navbar = event.currentTarget;
        const rect = navbar.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const blockWidth = 200 / gridCols;
        const blockHeight = 50 / gridRows;
        const col = Math.floor(mouseX / blockWidth);
        const row = Math.floor(mouseY / blockHeight);
        const centerIndex = row * gridCols + col;

        let updated = blocks.map(block => ({ ...block, isBlue: false }));

        const distances = updated.map((block, index) => {
            const blockRow = Math.floor(index / gridCols);
            const blockCol = index % gridCols;
            const distance = Math.sqrt((blockCol - col) ** 2 + (blockRow - row) ** 2);
            return { index, distance };
        });

        distances.sort((a, b) => a.distance - b.distance);
        const nearestThree = distances.slice(0, 3).map(d => d.index);

        updated = updated.map((block, index) => ({
            ...block,
            isBlue: nearestThree.includes(index) && !block.isBlack
        }));

        if (centerIndex >= 0 && centerIndex < updated.length && !updated[centerIndex].isBlack) {
            setTimeout(() => {
                updated = updated.map((block, i) => ({
                    ...block,
                    isRed: i === centerIndex && !block.isBlack
                }));
                setBlocks([...updated]);
                setTimeout(() => {
                    updated = updated.map((block, i) => ({
                        ...block,
                        isRed: i === centerIndex ? false : block.isRed
                    }));
                    setBlocks([...updated]);
                }, 500);
            }, 100);
        }

        setBlocks([...updated]);
    }

    function handleClick(index, blocks, setBlocks, blackBlocks) {
        if (!$user) {
            notifyLoginRequired();
            return;
        }

        if (blackBlocks.length < 2 && !blocks[index].isBlack) {
            const updated = blocks.map((block, i) => ({
                ...block,
                isBlack: i === index ? true : block.isBlack,
                isBlue: i === index ? false : block.isBlue,
                isRed: i === index ? false : block.isRed
            }));

            blackBlocks.push(index);

            if (blackBlocks.length === 1) {
                updated[index].navigateTo = '/create';
            } else if (blackBlocks.length === 2) {
                updated[index].navigateTo = '/gallery';
            }

            setBlocks([...updated]);
        } else if (blocks[index].isBlack && blocks[index].navigateTo) {
            goto(blocks[index].navigateTo);
        }
    }

    function handleMouseLeave(setBlocks, blocks) {
        setBlocks(blocks.map(block => ({ ...block, isBlue: false, isRed: false })));
    }

    // Protected navigation function
    function navigateTo(route) {
        if ($user) {
            goto(route);
        } else {
            notifyLoginRequired();
        }
    }
</script>

<div class="navbar-row">
    <!-- Navbar 1 -->
    <div
        class="navbar"
        on:mousemove={(e) => handleMouseMove(e, blocks1, b => blocks1 = b)}
        on:mouseleave={() => handleMouseLeave(b => blocks1 = b, blocks1)}
    >
        {#each blocks1 as block (block.id)}
            <div
                class="block"
                class:black={block.isBlack}
                class:blue={block.isBlue}
                class:red={block.isRed}
                on:click={() => handleClick(block.id, blocks1, b => blocks1 = b, blackBlocks1)}
            ></div>
        {/each}
    </div>

    <div class="label-box" on:click={() => navigateTo('/create')}>Create</div>

    <!-- Navbar 2 -->
    <div
        class="navbar alt-theme"
        on:mousemove={(e) => handleMouseMove(e, blocks2, b => blocks2 = b)}
        on:mouseleave={() => handleMouseLeave(b => blocks2 = b, blocks2)}
    >
        {#each blocks2 as block (block.id)}
            <div
                class="block"
                class:black={block.isBlack}
                class:alt-blue={block.isBlue}
                class:alt-red={block.isRed}
                on:click={() => handleClick(block.id, blocks2, b => blocks2 = b, blackBlocks2)}
            ></div>
        {/each}
    </div>

    <div class="label-box" on:click={() => navigateTo('/todo')}>List</div>
    <div class="label-box" on:click={() => navigateTo('/gallery')}>Gallery</div>

    <!-- Navbar 3 -->
    <div
        class="navbar alt-theme-2"
        on:mousemove={(e) => handleMouseMove(e, blocks3, b => blocks3 = b)}
        on:mouseleave={() => handleMouseLeave(b => blocks3 = b, blocks3)}
    >
        {#each blocks3 as block (block.id)}
            <div
                class="block"
                class:black={block.isBlack}
                class:alt2-blue={block.isBlue}
                class:alt2-red={block.isRed}
                on:click={() => handleClick(block.id, blocks3, b => blocks3 = b, blackBlocks3)}
            ></div>
        {/each}
    </div>

    <!-- Menu with Icons -->
    <div class="menu-bar">
        {#if $user}
            <div class="menu-block logout" on:click={onAuthToggle} title="Logout">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </div>
            <div class="menu-block avatar" on:click={() => navigateTo('/settings')}>
                <img src={$avatarUrl} alt="avatar" class="avatar-image" />
            </div>
        {:else}
            <div class="menu-block login" on:click={handleSignInClick} title="Login">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
            </div>
        {/if}
        <div class="menu-block about" on:click={() => navigateTo('/about')} title="About">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        </div>
    </div>
</div>

{#if showAuthModal}
    <div class="modal-debug">Modal should be visible</div>
    <AuthModal
        bind:show={showAuthModal}
        on:authSuccess={async () => {
            console.log('Auth success event');
            await invalidateAll();
            const redirectTo = localStorage.getItem('sb-redirect') || '/';
            localStorage.removeItem('sb-redirect');
            console.log('Redirecting after auth success:', redirectTo);
            goto(redirectTo, { replaceState: true });
        }}
        on:authError={({ detail }) => {
            console.log('Auth error:', detail.message);
            showAuthModal = false;
        }}
    />
{/if}

<style>
   .navbar-row {
    display: flex;
    align-items: center;
    gap: 0;
}

.navbar {
    width: 200px;
    height: 50px;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 1px;
    background-color: #f0f0f0;
}

.block {
    background-color: #ccc;
    transition: background-color 0.3s;
}

.block:hover {
    cursor: pointer;
}

.blue { background-color: blue !important; }
.red { background-color: red !important; }
.black { background-color: black !important; }

.alt-blue { background-color: teal !important; }
.alt-red { background-color: orange !important; }

.alt2-blue { background-color: purple !important; }
.alt2-red { background-color: yellow !important; }

.label-box {
    width: 200px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    font-family: monospace;
    background-color: #eee;
    transition: all 0.2s ease;
    cursor: pointer;
}

.label-box:hover {
    background-color: #ddd;
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

.menu-bar {
    width: 200px;
    height: 50px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background-color: #222;
}

.menu-block {
    background-color: #555;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    overflow: hidden;
}

.menu-block:hover {
    filter: brightness(1.3);
    transform: scale(1.05);
}

.icon {
    stroke: white;
    width: 24px;
    height: 24px;
}

.logout { background-color: crimson; }
.about { background-color: gold; }
.login { background-color: green; }
.avatar { background-color: #4a86e8; }

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.modal-debug {
    position: fixed;
    top: 10px;
    left: 10px;
    color: red;
    font-size: 14px;
    z-index: 2000;
}

</style>