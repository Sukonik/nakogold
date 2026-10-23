# Nako Gold — Artist Management Hub

## Current implementation
- `artist-management.html` is a public static **launchpad** for Nako Gold / Gold Earth Records.
- Links to Spotify for Artists, Spotify Manage team permissions, public Nako Gold Spotify profile and Spotify's team invitation instructions.
- No Spotify credentials, API secrets, financial data, personal team email addresses, or private analytics are stored.
- The page carries `noindex,nofollow` for search-engine discouragement, **not access control**.
- It is not linked from the public homepage by default.

## True private management (future)
GitHub Pages cannot enforce authentication for a public static management page. To add real private data, use a separate authenticated application or controlled-access service.

Minimum safeguards:
1. Authenticate users with a suitable identity provider and authorize each account server-side.
2. Keep tokens and app secrets on a backend and encrypt sensitive data at rest.
3. Respect Spotify API/Spotify for Artists limitations; do not scrape private dashboards or imply official Spotify integration where none exists.
4. Apply least privilege to collaborators; the Nako Gold owner retains team-administration authority.
5. Keep private analytics and financial information out of public repository commits, HTML, URLs and localStorage.
6. Log sensitive administrative changes and require explicit human approval for access or payment changes.

## Useful links
- Spotify for Artists: https://artists.spotify.com/
- Team permissions: https://manage.spotify.com/teams
- Nako Gold listener profile: https://open.spotify.com/artist/6n4s5S0cGiMsW4oJvIwU2L
- Inviting team members: https://support.spotify.com/artists/article/inviting-team-members/

## Follow-up
Build a true authenticated Artist Operations dashboard only after confirming desired data sources and appropriate access methods.