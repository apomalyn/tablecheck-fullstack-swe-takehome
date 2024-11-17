# Virtual Waitlist API

## Requirements

- Ruby v3.1 or higher
- Docker v27 or higher (for the database)

## Local MongoDB and initialization

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
3. Open a terminal in the `mongo-db` folder then execute: `docker compose up`
4. (Optional) Verify the installation.
   1. In a browser, open `http://localhost:8081`
   2. Sign in mongo-express
   3. You should see a `virtual_waitlist_db` database.

You should now have a functional Mongo database available under `http://localhost:27017`.
