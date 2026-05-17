# create_20_issues.ps1
# Automates the creation of the 10 selected GSSoC'26 issues for DevPath-Community-Website using GitHub CLI (gh).

# Ensure gh CLI is installed
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "GitHub CLI (gh) is not installed or not in PATH. Please install it first."
    exit 1
}

# Verify login status
$loginCheck = gh auth status 2>&1
if ($loginCheck -match "Logged in to github.com") {
    Write-Host "Authenticated successfully with GitHub CLI." -ForegroundColor Green
} else {
    Write-Warning "Not logged in to GitHub. Please run 'gh auth login' to authenticate first."
    exit 1
}

# Define the 10 selected GSSoC issues with detailed description and endpoints
$issues = @(
    # --- CATEGORY A (Beginner Issues) ---
    @{
        Title = "[PERFORMANCE] Lazy Load Event Images using Next.js Image Component"
        Body = @"
### Description
Some thumbnail images in the Events dashboard are currently loaded using static CSS background images inline, which prevents Next.js's optimized image loader from lazy-loading and sizing them dynamically. This results in larger resource footprints and increases layout shifts on lower bandwidth connections.

### Files/Endpoints to Update
- **`src/components/home/Events.tsx`** (Refactor the `EventCard` component's thumbnail container at lines 98–106)
- **`src/components/home/Events.module.css`** (Adjust `.thumbnail` class definitions to support absolute position fit rules for the nested Next.js image wrapper)

### Proposed Solution
1. Import `Image` from `next/image` in `src/components/home/Events.tsx`.
2. Refactor the `<div className={styles.thumbnail} style={{ backgroundImage: ... }} />` structure to render a `<div className={styles.thumbnailContainer}>` containing a Next.js `<Image src={event.image} fill className="object-cover" alt={event.title} />`.
3. Provide a fallback local image or solid-colored background placeholder when `event.image` is undefined.

### Acceptance Criteria
- Thumbnail images must load natively using Next.js optimization.
- The UI must render correctly without stretching or distorting thumbnails on responsive screen sizes.
"@
        Labels = "gssoc26,level: begiinner,good first issue,enhancement"
    },
    @{
        Title = "[BUG] Fix Broken Breadcrumbs on Nested Wiki Pages"
        Body = @"
### Description
On deeply nested Wiki articles, the breadcrumb segment matching can fail if the categories fail to resolve or if an article slug doesn't exist, leading to undefined evaluation and potentially breaking client rendering (hydration mismatches or runtime JavaScript crashes).

### Files/Endpoints to Update
- **`src/app/wiki/page.tsx`** (Around lines 79-85 where `styles.breadcrumb` is rendered inside `WikiPage()`)

### Proposed Solution
1. Implement defensive programming safeguards to check if the resolved category title and article title are defined before rendering.
2. Provide a default fallback breadcrumb string (e.g. `Home > Wiki > Article`) if matching segments fail.
3. Automatically format slug IDs to readable capital case labels (e.g., `community-offerings` -> `Community Offerings`).

### Acceptance Criteria
- Accessing any dynamic or static article slug should never raise a Javascript runtime error.
- Breadcrumbs must render cleanly and provide safe, formatted category fallbacks when matching is unsuccessful.
"@
        Labels = "gssoc26,level: begiinner,good first issue,type:bug"
    },
    @{
        Title = "[FEATURE] Add a 'Copy Code' Button to Wiki Code Blocks"
        Body = @"
### Description
In order to enhance usability for students reading coding tutorials, all `<pre><code>` blocks displayed in Wiki articles or guides should contain a clean, interactive "Copy" button in the top-right corner.

### Files/Endpoints to Update
- **`src/app/wiki/page.tsx`** (Render block layout where `{wikiContent[activeArticle]?.content}` is displayed)
- **`src/data/wikiContent.tsx`** (Incorporate representative coding blocks or preformatted blocks inside article contents, e.g., under React guide or Setup)
- **`src/app/wiki/Wiki.module.css`** (Add class styling for the copy trigger icons and hover actions)

### Proposed Solution
1. In `src/app/wiki/page.tsx`, create a client-side wrapper or use a React Ref / native query selector inside a `useEffect` that loops through `<pre>` nodes inside the article body.
2. Render a styled, absolute-positioned copy button over the `<pre>` containers.
3. Implement `navigator.clipboard.writeText` to copy the snippet and display temporary "Copied!" checkmark feedback for 2 seconds.

### Acceptance Criteria
- Every preformatted code block in the Wiki must feature a non-obtrusive, highly accessible "Copy" button.
- Clicking the button must accurately copy only the raw code contents without metadata or trailing characters.
"@
        Labels = "gssoc26,level: begiinner,good first issue,enhancement"
    },
    @{
        Title = "[BUG] Fix Broken Next/Previous Page Links in Pathway Tutorial"
        Body = @"
### Description
In the pathway learning and guide modules, the paginated navigation anchors ("Next" and "Previous" button elements) occasionally link to incorrect route slugs or result in an empty page redirection when the boundaries of the course paths are reached.

### Files/Endpoints to Update
- **`src/components/home/LearningPaths.tsx`** (Validate card redirection routes)
- **`src/components/home/ResourcesTabs.tsx`** (Around the Tab switching / active roadmap details triggers)
- **`src/app/courses/page.tsx`** (Courses landing and timeline boundaries)

### Proposed Solution
1. Ensure the bounds of active paths array are strictly evaluated before allowing redirection.
2. Correctly disable or transition the "Next" button into a "Complete Path & Claim Badge" trigger when reaching the final pathway segment.
3. Ensure navigation paths correctly map to valid routes instead of appending malformed relative paths to the URL query string.

### Acceptance Criteria
- Clicking "Previous" on the initial page must be disabled.
- Reaching the final segment must elegantly guide users back to the paths list or show a completion status rather than throwing blank templates or redirecting to invalid paths.
"@
        Labels = "gssoc26,level: begiinner,good first issue,type:bug"
    },
    @{
        Title = "[DOCS] Comprehensive Contribution Guide for First-time Git Users"
        Body = @"
### Description
Help junior GSSoC'26 contributors navigate their very first Pull Request by introducing a beautifully written, beginner-friendly Git guidelines document. This will reduce invalid PRs and streamline maintainer review.

### Files/Endpoints to Update
- **`GIT_GUIDE.md`** (Create a brand-new markdown file in the project root)
- **`CONTRIBUTING.md`** (Update contribution instructions to hyperlink to the new guide)

### Proposed Solution
1. Draft a highly clear markdown document named `GIT_GUIDE.md`.
2. Cover: Forking the upstream repo, cloning locally, branch naming conventions (`feature/`, `bug/`), syncing the upstream master, resolving simple conflicts, squashing commits, and writing semantic commit messages.
3. Link the new guide prominently in `CONTRIBUTING.md`.

### Acceptance Criteria
- `GIT_GUIDE.md` must render beautifully on GitHub with clear markdown headings, sample terminal code blocks, and best practice warnings.
- The link in `CONTRIBUTING.md` must resolve successfully.
"@
        Labels = "gssoc26,level: begiinner,good first issue,documentation"
    },

    # --- CATEGORY B (Intermediate Issues) ---
    @{
        Title = "[FEATURE] Add a Search Filter to the Events Page"
        Body = @"
### Description
Our events list is growing rapidly. Users currently have to scroll manually through upcoming and completed sessions. We need to implement an instant client-side keyword search bar and filter tabs.

### Files/Endpoints to Update
- **`src/components/home/Events.tsx`** (Incorporate search matching and tab switches in state hooks, around the `Events()` functional component)
- **`src/components/home/Events.module.css`** (Add standard responsive styling rules for input search controls)

### Proposed Solution
1. Add a text search input field in `src/components/home/Events.tsx` equipped with a search icon (e.g. `Search` from `lucide-react`).
2. Implement local React states for `searchQuery` and `activeCategory` (e.g. All, Workshops, Webinars, Meetups).
3. Filter `upcomingEvents` and `completedEvents` dynamically by checking title, speaker names, or descriptions.
4. Render a clean "No events match your criteria" empty-state graphic when search yields zero matches.

### Acceptance Criteria
- Search filters should operate in real-time as the user types without causing page lags.
- Filtering must support both dark and light modes with proper font readability.
"@
        Labels = "gssoc26,level:intermediate,enhancement"
    },
    @{
        Title = "[FEATURE] Animated Profile Progress Ring for Gamification Level"
        Body = @"
### Description
Upgrade the user dashboard profile visualization by replacing the standard horizontal progress bar with a premium, animated circular SVG progress ring indicating XP tracking.

### Files/Endpoints to Update
- **`src/components/profile/UserProfile.tsx`** (Upgrade standard progress trackers in `UserProfile()` around the user progress bar sections)
- **`src/components/profile/Profile.module.css`** (Integrate standard animations and keyframe dashoffset adjustments)

### Proposed Solution
1. Create a customizable SVG progress circle component inside `src/components/profile/UserProfile.tsx` that computes SVG stroke dasharray and offset dynamically from XP percentage.
2. Apply linear/radial custom gradient styles matching DevPath's dark/cyan/purple branding.
3. Animate the ring on component load using CSS transitions or Framer Motion properties to give a modern, alive gamified feel.

### Acceptance Criteria
- The progress circle must accurately represent the current level progress percentage.
- The layout must remain completely responsive across different mobile viewports.
"@
        Labels = "gssoc26,level:intermediate,enhancement"
    },
    @{
        Title = "[BUG] Prevent Duplicate Event RSVPs in Firebase"
        Body = @"
### Description
Currently, rapidly clicking the event RSVP button can write duplicate documents to the database or increment counts multiple times. We need to lock the action, introduce debouncing, and enforce proper Firestore write checks.

### Files/Endpoints to Update
- **`src/components/RSVPButton.tsx`** (Around the `handleRSVP` method and click event attributes)

### Proposed Solution
1. Inside the RSVP trigger, immediately disable the button and swap button text with a loading spinner component.
2. Query the user's registered event collection or write using a specific unique ID (e.g. `db.collection('rsvps').doc('${userId}_${eventId}')`).
3. Handle errors gracefully and ensure user is notified if they have already registered or if an internet delay occurs.

### Acceptance Criteria
- Double clicking or rapid pressing should be structurally impossible to create duplicate Firebase entries.
- Displays loading state indicators seamlessly when writing.
"@
        Labels = "gssoc26,level:intermediate,type:bug"
    },
    @{
        Title = "[FEATURE] Real-time Toast Notifications for Achievements"
        Body = @"
### Description
Bring the gamification system to life! Whenever a user earns points, levels up, or completes a pathway milestone, we should notify them using a beautiful, premium real-time toast alert instead of a static layout container.

### Files/Endpoints to Update
- **`src/context/GamificationContext.tsx`** (Update notification render structures inside the `GamificationProvider`)
- **`src/app/layout.tsx`** (Incorporate dynamic context wrappers if required)

### Proposed Solution
1. Replace the mock inline-styled div block at the bottom of `GamificationContext.tsx` with a fully featured toast component.
2. Build custom Framer Motion notification card designs with micro-animations.
3. Trigger distinct themes based on type: Green for level-ups, Purple/Gold for achievements, Cyan for XP.

### Acceptance Criteria
- Toast messages must slide in smoothly and auto-dismiss after 4 seconds.
- Triggers must work globally from any component invoking `addXp()` through the context hook.
"@
        Labels = "gssoc26,level:intermediate,enhancement"
    },
    @{
        Title = "[FEATURE] Certificate Sharing buttons for Social Media"
        Body = @"
### Description
Give participants of the HackFiesta or course pathways a premium way to boast about their performance. Add sharing hooks to easily post verified achievements straight to LinkedIn, Twitter/X, and WhatsApp.

### Files/Endpoints to Update
- **`src/app/certificate/page.tsx`** (Dynamic page renderer around certificate cards)
- **`src/components/certificate/RankingsTable.tsx`** (Add standard buttons beside top row standings or within active rank highlights)

### Proposed Solution
1. Design beautiful social button components (LinkedIn, Twitter/X, and WhatsApp share buttons).
2. Wire social intents to append the verified page link: `https://devpath-website.web.app/certificate?open=hackfiesta` or user specific certificate link.
3. Set appropriate OpenGraph meta-tags so sharing cards pull dynamic visual preview elements.

### Acceptance Criteria
- Social sharing hooks must correctly open a new tab populated with optimized post texts.
- Icons must follow modern brand guidelines (e.g. X instead of the old Twitter bird).
"@
        Labels = "gssoc26,level:intermediate,enhancement"
    }
)

Write-Host "Prepared $($issues.Count) selected GSSoC issues for creation." -ForegroundColor Cyan

$count = 0
foreach ($issue in $issues) {
    $count++
    Write-Host "[$count/10] Creating: $($issue.Title)..." -ForegroundColor Yellow
    
    # Run gh issue create
    $createdIssue = gh issue create --title $issue.Title --body $issue.Body --label $issue.Labels --assignee "@me" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully created! URL: $createdIssue" -ForegroundColor Green
    } else {
        Write-Error "Failed to create issue: $($issue.Title). Error: $createdIssue"
    }
    
    # Tiny pause to avoid API rate limits
    Start-Sleep -Seconds 1
}

Write-Host "All done! Created $count GSSoC'26 issues successfully." -ForegroundColor Green
