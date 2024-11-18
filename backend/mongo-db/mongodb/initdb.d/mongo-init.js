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

db.createCollection("restaurants");
db.restaurants.insertOne({
    _id: ObjectId("000000000000000000000001"),
    name: "My Little Café",
    capacity: 10,
    current_capacity: 10,
    max_party_size: 10,
    created_at: new Date(),
    updated_at: new Date()
})