<script lang="ts">
    // Replace '#' with actual paths
    const links = [
        { name: 'Terms', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Contact', href: '/contact' }
    ];
</script>

<footer class="footer">
    <div class="footer-links">
        {#each links as link}
            <a href={link.href} class="footer-link">{link.name}</a>
        {/each}
    </div>
    <p class="copyright">© {new Date().getFullYear()} Pexos. All rights reserved.</p>
</footer>

<style>
    .footer {
        padding: 2rem;
        text-align: center;
        background-color: #f5f5f5;
    }
    
    .footer-links {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .footer-link {
        color: #333;
        text-decoration: none;
    }
    
    .footer-link:hover {
        text-decoration: underline;
    }
    
    .copyright {
        color: #666;
        font-size: 0.9rem;
    }
</style>