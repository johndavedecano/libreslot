# LibreSlot

![My Image](https://raw.github.com/johndavedecano/libreslot/main/logo.png)

LibreSlot is a cutting-edge, open-source appointment system designed to streamline the scheduling process with efficiency and style. Built on the powerful combination of SvelteKit, Tailwind CSS, Daisy UI, and Firebase, this app offers a seamless and modern experience for both users and developers alike.

## System Requirements

- NodeJS
- Firebase Account

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

Please make sure that you update .env file.

```bash
cp .env.example .env

code .env

```

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
