# Quick local install

### Requirements

- Ruby v3.1 or higher
- Docker v27 or higher (for the database)
- NPM v10 or higher

### Local installation

Install dependencies

```bash
    # Install backend dependencies
    cd backend
    gem install bundler
    bundle install
    
    # Install frontend dependencies
    cd ../frontend
    npm ci
    
    # Return to project root
    cd ..
```

Start database

```bash
    cd backend/mongo-db
    # Start MongoDB and detach.
    docker compose up --wait
        
    # Return to project root
    cd ../../
```

Start API

```bash
    cd backend
    bin/rails server
    
    # Return to project root
    cd ../
```

Check API and database are up

```bash
    curl http://localhost:3000/restaurants/000000000000000000000001
```
    
Should return the following JSON:

```json
{"uuid":"000000000000000000000001","name":"My Little Café","capacity":10,"current_capacity":10,"max_party_size":10}
```

Start frontend

```bash
    cd frontend
    npm run dev
```

Open in a browser: [http://localhost:5173](http://localhost:5173). You should see a form
in the center of the screen.

Everything is up and running! 🎉