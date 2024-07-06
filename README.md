# Cachaca

An AI-powered open source e-commerce solution.

The project is developed on top of:

- [Remix](https://remix.run/)
- [Tailwind](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [Drizzle](https://orm.drizzle.team/)

## Demo

**Note**: This project is still at its very early stage. I'm currently working on the frontend development with all the mock data. No backend services is ready at the moment.

[https://main--roaring-gnome-50b6e1.netlify.app/](https://main--roaring-gnome-50b6e1.netlify.app/)

## Development

Run the dev server:

```shellscript
yarn dev
```

### i18 localization

We use the **remix-i18next** package. To add a translation item, you should:

1. Create a new **translation.json** file under the _**public/locales/<locale_code>/**_ directory if the file does not exist yet, and make sure you copy all the translation items from the _**public/locales/en/translation.json**_ file.

2. Follow the naming convention for the translation keys:

   - All pre-defined translation keys have the **system.** prefix, for example, **system.login** is translated as **Login** in English. These keys are used for the static instructions/description of the UI components.

   - If you wish to add your own UI components with custome translation, please use the prefix **custom.**. For instance, if you want to add translation for the word **Dropshipping**, you should add a new key `{"custom.dropshipping": "Dropshipping"}` in the translation.json files.

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```

Now you'll need to pick a host to deploy it to.

## Attribution

The photos/images that are used for development and demo purposes are from [https://www.pexels.com/](https://www.pexels.com/)
