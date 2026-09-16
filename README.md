Campus Lost & Found

A class project by Dagmawi Begashaw. Students can post a lost or found item with its name and location, and view posts stored online in Supabase.

Repository: https://github.com/DagmawiSamson/campus--lost-and--found

Features

Add a Lost or Found post with an item name and location.

Reject submissions with missing or blank fields.

Load the latest 100 posts, newest first.

Refresh to see posts added from another device.

Store posts in Supabase so they remain after reloading.

Display request errors and disable action buttons during requests.

Tools

Expo SDK 57, React Native, React, TypeScript, and Supabase Postgres with its generated REST API. Development used an HP Windows laptop, VS Code, and Expo Go on an iPhone 13. The browser version was also tested. Android device testing has not yet been documented.

Setup

Install Node.js LTS, Git, and Expo Go on your phone. Node.js v24.21.0 was used during development. Accept the collaborator invitation if the repository is private.

git clone https://github.com/DagmawiSamson/campus--lost-and--found.git
cd campus--lost-and--found
npm install

Create .env in the project root using .env.example as a template:

EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY

For the shared class backend, obtain the actual Project URL and publishable key from the project owner. Do not run the database creation SQL again against that existing backend. The placeholders above are not a live API address.

Use only the publishable key in the app. It is included in the client bundle; database grants and policies control access. Never use a secret key, service-role key, or database password in the app. Keep .env out of Git.

Run on a phone

npm start

Keep the development server running. Connect the laptop and phone to the same Wi-Fi. Scan the QR code with the iPhone camera and open it in Expo Go. If prompted, sign into the same Expo account in Expo Go and on the laptop using npx expo login.

Restart the server and reload the app after changing .env.

Run in a browser

Press w in the running Expo terminal, or run:

npm run web

The ios script launches Expo's iOS target; it does not make an iOS simulator available on Windows. The documented Windows/iPhone workflow uses physical-device Expo Go testing.

Backend setup for a new project

Create a Supabase project.

Open its SQL Editor and run supabase/schema.sql once.

Put the new project's URL and publishable key in .env.

Start the app and add a sample post.

Verify the matching row in Supabase's Table Editor under public.items.

The SQL file defines the table, field constraints, grants, and row-level security policies. Supabase hosts the generated API; no separate custom API server is included.

REST API

The endpoint is the configured EXPO_PUBLIC_SUPABASE_URL followed by /rest/v1/items. Include the publishable key in the apikey header.

Method

Path

Purpose

GET

/rest/v1/items?select=id,name,location,status&order=created_at.desc&limit=100

Load the latest posts

POST

/rest/v1/items

Create a post

POST requests use Content-Type: application/json and Prefer: return=representation with a body such as:

{"name":"Blue water bottle","location":"Library","status":"Found"}

The database generates the UUID and creation timestamp. Names must contain 1–100 characters after trimming; locations must contain 1–200. Status must be Lost or Found.

Access and limitations

This is a public-posting classroom demo: users of the API can read and create posts without signing in. Client roles cannot update or delete posts. There is no account system, moderation, photo upload, or contact/claim workflow. Use sample data without personal contact information. Refresh is manual; new posts do not automatically stream to other devices.

Manual verification

The following tests were reported as passed by the developer:

Test

Result

Submit without an item name

Missing-information alert appears

Add one Lost and one Found item

Both display with the correct labels

Add a post and inspect Supabase

Matching database row appears

Reload the phone app

Saved post remains

Add a post in the browser, then refresh on iPhone

The same post appears on the phone

These are manual checks, not automated test results. Keep screenshots for the individual submission report.

Troubleshooting and learning

Expo requested authentication: signed into Expo Go and Expo CLI with the same account.

New imports disappeared on save: unused-import cleanup was suspected; adding code that used the imports resolved the editing workflow.

Add item looked missing: it was disabled while the initial database request was loading. Temporary loading/saving labels helped inspect state.

Supabase requests stalled: the Project URL was incorrect. Correcting .env and restarting restored access. The app also includes a 15-second abort timeout and error display.

Collaboration

The owner invited a classmate as a GitHub collaborator and shared the backend connection settings privately. The actual code exchange and device tests must still be recorded when completed.

Both students should document cloning/pulling, building/running, making a small change, testing on a device, committing/pushing, and receiving/testing the other person's changes. Preserve commit history and screenshots; each student writes their own account of the work.

References and AI assistance

https://docs.expo.dev/tutorial/create-your-first-app/ — starter project and physical-device development workflow.

https://docs.expo.dev/guides/environment-variables/ — accessing project settings through EXPO_PUBLIC_ variables.

https://supabase.com/docs/guides/api — generated REST API and database access.

https://supabase.com/docs/guides/getting-started/api-keys — publishable keys versus server-only keys.

https://supabase.com/docs/guides/database/postgres/row-level-security — database grants and access policies.

ChatGPT (https://chatgpt.com/) assisted with setup, explanations, app and SQL code, Git commands, debugging, test planning, and this README. 