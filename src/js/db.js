const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

//using mongoose models
const UserSchema = mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    username: String,
    password: String,
    receipts: [
        {
            date: Date,
            name: String,
            party: [String],
            foodItems: [
                {
                    name: String,
                    quantity: Number,
                    unitPrice: Number,
                    partyMembers: [String]
                }
            ],
            tax: Number,
            tip: Number
        }
    ]
});

let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...

    const fn = path.resolve(__dirname, '../../config.json');
    const data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = "mongodb://localhost/ll3540";
}

mongoose.model('User', UserSchema);
mongoose.connect(dbconf, (err) => {
    console.log(dbconf);
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database');
    }
});