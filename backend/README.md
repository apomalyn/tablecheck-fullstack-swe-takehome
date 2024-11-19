# Virtual Waitlist - API

API for the virtual waitlist.

Made with ❤️ with Ruby On Rails and MongoDB for TableCheck code assessment.

## Requirements

- Ruby v3.1 or higher
- Docker v27 or higher (for the database)

## Run Locally

The API uses a MongoDB application to save the restaurant configuration and waitlist. To facilitate the initial setup
a docker compose with seed data are available under `/mongo-db`. The docker compose contains a mongodb server and 
mongo-express to visualize the database easily.

⚠️ This setup is for local use only. DO NOT USE IN A PRODUCTION ENVIRONMENT.

To initialize the database, follow those steps:

1. (Optional) Update the `mongo-db/.env` to change the default root username and password for both mongo and mongo-express.
2. (Optional) Update the API service username and password:
   1. Open `mongo-db/mongodb/initdb.d/mongo-init.js`
   2. Modify the lines 4 and 5 with the new username and password.
   3. Modify `config/mongoid.yml` lines 12 and 13 accordingly
3. Open a terminal in the `mongo-db` folder then execute: 
```bash
  cd mongo-db
  docker compose up
```
4. (Optional) Verify the installation.
   1. In a browser, open `http://localhost:8081`
   2. Sign in mongo-express
   3. You should see a `virtual_waitlist_db` database.

You should now have a functional Mongo database available under `http://localhost:27017`.

Install dependencies

```bash
  gem install bundler

  bundler install
```

Start the application

```bash
  bin/rails server
```

Test the application

```bash
    curl http://localhost:3000/restaurants/000000000000000000000001     
```

You should receive the following

```json
{"uuid":"000000000000000000000001","name":"My Little Café","capacity":10,"current_capacity":10,"max_party_size":10}
```

If so, the API is now fully working!

You can explore the available endpoints with the [OpenAPI contract](./docs/openapi-spec.yaml) situated in the docs. Or by loading the [Bruno](https://www.usebruno.com/) collection under `bruno`

## Other commands

To run the linter:

```bash
  bin/rails rubocop [--autocorrect]
```

To execute all the tests:

```bash
   bundle exec rspec
```


## Related

[Frontend README](../frontend/README.md)

