const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ISSUES = [
    {
        title: '[FEATURE] Implement Interactive AI Chat System for DevPath Assistant',
        labels: ['gssoc', 'gssoc-ext', 'enhancement', 'feature', 'high-impact'],
        body: `**Is your feature request related to a problem? Please describe.**
The DevPath portal currently renders a beautiful \`FloatingAssistant\` UI widget on all non-auth pages. However, it is currently a static UI placeholder: selecting suggestions or sending text input does not trigger any backend calls or conversational updates, as the \`onSend\` and \`onSuggestionSelect\` handlers are not implemented. 

**Describe the solution you'd like**
Implement a fully interactive AI Chat System:
1. **API Integration**: Create a Next.js App Router API route (\`src/app/api/assistant/chat/route.ts\`) that integrates with the Google Gemini API (or OpenAI/Vercel AI SDK).
2. **Context Customization**: Pass a system prompt containing general details about DevPath (learning paths, community guidelines, events, open-source dashboard, etc.) to ensure responses are contextualized to DevPath's ecosystem.
3. **UI Enhancements**:
   - Update \`src/components/assistant/assistant-panel.tsx\` to maintain a conversation log (\`messages\` array of user and assistant responses).
   - Display chat bubbles for messages in a scrollable view inside the panel, replacing/collapsing the suggestion grid once a conversation starts.
   - Implement loading and typing animations (such as skeletons or pulse dots) while waiting for the API response.
4. **State Persistence (Optional/Bonus)**: Session-based persistence of chat history so history isn't lost on page reload.

**Describe alternatives you've considered**
Using a third-party chat widget (like Crisp or Intercom), but building a custom AI Assistant tailored to DevPath provides a cleaner developer-focused onboarding experience and leverages Next.js API capabilities.

**Additional context**
- Frontend component is located at [floating-assistant.tsx](file:///src/components/assistant/floating-assistant.tsx).
- Follow styling guidelines from \`THEME_COLORS_DOCUMENTATION.md\` for proper dark theme gradients.`
    },
    {
        title: '[FEATURE] Event RSVP "Add to Calendar" Sync & Automated Confirmation Email',
        labels: ['gssoc', 'gssoc-ext', 'enhancement', 'feature', 'high-impact'],
        body: `**Is your feature request related to a problem? Please describe.**
DevPath allows authenticated users to RSVP for community events via the \`RSVPButton\` component, which registers their email/UID in Firestore. However, once registered, there is no automatic system to send them confirmation emails, nor any feature to export the event details to their personal calendars (such as Google Calendar, Outlook, or Apple Calendar). Users might easily forget event timings as a result.

**Describe the solution you'd like**
Add calendar synchronization and automated notification capabilities:
1. **Add to Calendar Buttons**:
   - Update the RSVP success state in \`src/components/RSVPButton.tsx\` (once registered) to display an "Add to Calendar" dropdown/action list.
   - Provide links to add the event to:
     - **Google Calendar** (via formatted template URL).
     - **Outlook / Yahoo Calendar** (via formatted URL).
     - **iCal / Generic** (by generating and downloading an \`.ics\` file dynamically using client-side JS or a lightweight helper).
2. **Automated RSVP Email Confirmations**:
   - Create a server-side handler/endpoint (\`src/app/api/events/rsvp-email/route.ts\`) or trigger a Firebase Cloud Function.
   - Use a transactional email provider (such as Resend, SendGrid, or Nodemailer) to send a beautifully styled HTML email to the user confirming their registration.
   - The email should contain:
     - Event title, description, time (with timezone helper), and location/joining link.
     - A calendar \`.ics\` invite attachment so it automatically adds to their calendar inbox.

**Describe alternatives you've considered**
Directing users to manually copy event times, which is error-prone and offers poor UX.

**Additional context**
- The RSVP component code is located at [RSVPButton.tsx](file:///src/components/RSVPButton.tsx).
- The Event component is located at [Events.tsx](file:///src/components/home/Events.tsx).`
    }
];

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
    console.log("=== GitHub Issue Creator for DevPath (GSSoC 2026) ===");
    const repo = await askQuestion("Enter repository (default: komalharshita/DevPath): ") || "komalharshita/DevPath";
    const token = await askQuestion("Enter your GitHub Personal Access Token (PAT): ");

    if (!token) {
        console.error("Error: GitHub Personal Access Token is required to open issues.");
        rl.close();
        return;
    }

    console.log(`\nPreparing to open 2 issues in '${repo}'...\n`);

    for (let i = 0; i < ISSUES.length; i++) {
        const issue = ISSUES[i];
        console.log(`Creating Issue ${i + 1}: "${issue.title}"...`);
        
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Node-Fetch-Client'
                },
                body: JSON.stringify({
                    title: issue.title,
                    body: issue.body,
                    labels: issue.labels
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error(`Failed to create Issue ${i + 1}: Status ${response.status} - ${response.statusText}`);
                console.error("GitHub API response error details:", JSON.stringify(errData, null, 2));
                continue;
            }

            const data = await response.json();
            console.log(`Success! Issue ${i + 1} created: ${data.html_url}`);
        } catch (error) {
            console.error(`Network/System error creating Issue ${i + 1}:`, error.message);
        }
        console.log("--------------------------------------------------");
    }

    console.log("\nFinished processing issues.");
    rl.close();
}

main().catch(err => {
    console.error("Unexpected error:", err);
    rl.close();
});
