# Virtual Waitlist - Front end

Customer UI for the virtual waitlist. This should not be used by the restaurant owners.

Made with ❤️ with React and Vite for TableCheck code assessment.

## Requirements

-   npm v10 or higher
-   the API deployed (see [backend README](../backend/README.md) for more information)

## Run Locally

This assumes you have cloned the repository locally and all commands will be executed at the root of the project.

Install dependencies

```bash
  npm install
```

Define the `.env` file

```bash
  cp .env.template .env
```

Update the content of the `.env` file with your own values.

-   `API_BASE_URL`: base URL for the API, including `http://` but excluding the trailing `/`. For example: `http://localhost:3000`
-   `RESTAURANT_UUID`: UUID of the restaurant to use. If you want to use the default restaurant (for development purpose only), use the following `000000000000000000000001`.

Start the application.

```bash
  npm run dev
```

Open the url shown on your terminal (by default: [http://localhost:5173/](http://localhost:5173/)). And enjoy!

## Other commands

To run the linter:

```bash
  npm run lint
```

To run prettier:

```bash
  npm run prettier[:write] # [:write] apply the changes
```

To build the application:

```bash
  npm run build
```

To execute the tests

```bash
    npm run test
```

## Related

[Backend API README](../backend/readme.md)
