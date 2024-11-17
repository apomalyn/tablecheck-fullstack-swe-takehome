db = db.getSiblingDB("virtual_waitlist_db");

db.createUser({
    user: "api-service",
    pwd: "api-service",
    roles: [
        {
            role: "readWrite",
            db: "virtual_waitlist_db"
        }
    ]
});

db.createCollection("waitlist");

db.waitlist.insertOne({
    configuration: {
        name: "My Little Café",
        capacity: 10,
        max_party_size: 10
    },
    waiting: []
})