# ![Cachaca logo](https://github.com/ccwukong/Cachaca/blob/main/public/favicon.ico) Cachaca

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

### Database

We use MySQL database as the default database. It's recommended to use Docker containers for your local development to ensure consistency of development environment among contributors.

To set up the database using Docker, first make sure you have the database environment variables configured in your **.env** file in the root directory.

Then, you can run the following command:

```shellscript
docker compose up -d
```

The default template of the **.env** file

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=<database username>
DB_PASS=<database user's password>
DB_ROOT_PASS=<database root user's password, used by docker-compose>
DB_NAME=<database name>
JWT_TOKEN_SECRET=<a long random string that is used to sign JWT auth token>
SESSION_COOKIE_SECRET=<a long random string that is used to sign cookie message>
OPENAI_API_KEY=<this key is for all the AI features, you can create one on OpenAI developer console>
```

### i18n localization

We use the **remix-i18next** package. To add a translation item, you should:

1. Create a new **translation.json** file under the _**/public/locales/<locale_code>/**_ directory if the file does not exist yet, and make sure you copy all the translation items from the _**/public/locales/en/translation.json**_ file.

2. Follow the naming convention for the translation keys:

   - All pre-defined translation keys have the **system.** prefix, for example, **system.login** is translated as **Login** in English. These keys are used for the static instructions/description of the UI components.

   - If you wish to add your own UI components with new translation items, please use the prefix **custom.**. For instance, if you want to add translation for the word **Dropshipping**, you should add a new key `{"custom.dropshipping": "Dropshipping"}` in the translation.json files.

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
