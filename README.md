# ![Cachaca logo](https://github.com/ccwukong/Cachaca/blob/main/public/favicon.ico) Cachaca

[![Demo deployment](https://github.com/ccwukong/Cachaca/actions/workflows/demo.yml/badge.svg)](https://github.com/ccwukong/Cachaca/actions/workflows/demo.yml)

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

### Development environment

- Node.js >= 18.0.0
- MySQL 8
- Remix v2

Run the dev server:

```shellscript
yarn dev
```

### Database

We use MySQL database as the default database. It's recommended to use Docker containers for your local development to ensure consistency of development environment among contributors.

To set up the database using Docker, first make sure you have the database environment variables configured in your **.env** file under the root directory.

Then, you can run the following command:

```shellscript
docker compose up -d
```

The default template of the **.env.dev** file

```
CONNECTION_STRING=mysql://<user>:<password>@<host>:<port>/<database name>
JWT_TOKEN_SECRET=<a long random string that is used to sign JWT auth token>
SESSION_COOKIE_SECRET=<a long random string that is used to sign cookie message>
```

### File hosting

Cachaca is designed to be deployed in different environments including Serverless environments, therefore, it is our design decision to use a file/object hosting service to host all multimedia files such as product images, audio/video files etc.

By default, Cachaca uses [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) as it provides a generous free tier hosting quota.

You can also use other file/object storage service providers by customizing the integration yourself:

- [AWS S3](https://aws.amazon.com/s3/) - 12 months free tier available
- [Cloudinary](https://cloudinary.com/pricing) - Free tier available
- [Google cloud storage](https://cloud.google.com/storage/pricing#price-tables)
- Many more...

### i18n localization

We use the **remix-i18next** package. To add a translation item, you should:

1. Create a new **<language code>.json** file under the _**/public/i18n/**_ directory if the file does not exist yet, and make sure you copy all the translation keys from the _**/public/i18n/en.json**_ file. For example, to add Japanese as a new language, you need to create **ja.json** under the _**/public/i18n/**_ directory, and make sure to copy all the tranlation keys from _**/public/i18n/en.json**_ file to the new **ja.json** file.

2. Follow the naming convention for the translation keys:

   - All pre-defined translation keys have the **system.** prefix, for example, **system.login** is translated as **Login** in English. These keys are used for the static instructions/description of the UI components.

   - If you wish to add your own UI components with new translation items, please use the prefix **custom.**. For instance, if you want to add translation for the word **Dropshipping**, you should add a new key `{"custom.dropshipping": "Dropshipping"}` in the translation.json files.

3. Add the new language code as a supported language in the **/app/i18n.ts** file.

### Customization

Cachaca allows you to develop your own themes and plugins on top of default UI components and features to a great extent. However, there are a few development guidelines you should adopt in order to keep this project scalable and maintainable.

#### Creating a new theme

If you wish to create a custom theme for any reasons, you shall follow the guidelines below:

- Create a new directory under the **/app/themes** directory with the name of your theme, for instance, if you want to create a new theme called **Urban**, you should create a new directory named **urban** _**(all theme names should be in lower case)**_ and the directory structure will look like this **/app/themes/urban**.

- In your own theme directory, you should separate your UI components into **components** and **pages**, where components consists of common React UI components and shadcn components, and pages directory consists of container components of each **Route**, for instance, one of the pre-defined routes **/app/routes/cart.tsx** invokes the **<Cart {...props} />** container component from the **/app/themes/default/pages/storefront/Cart.tsx** file.

- If you only wanted to customize the UI components for storefront, and use the default components from the **default** theme, you can copy the rest of the directories and files into your own theme directory.

- Make sure you add all the new translation keys under the **/public/i18n/** directory accordingly.

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

## License

[Open Software License ("OSL") v. 3.0](LICENSE)

## Attribution

- The dummy product photos/images that are used for development and demo purposes are from [https://www.pexels.com/](https://www.pexels.com/)

- The logo/icon of Cachaca project is from [https://www.freepik.com/](https://www.freepik.com/)
