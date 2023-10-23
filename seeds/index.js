const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db open");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 100);
    const camp = new Campground({
      author: "64bf8bcd11042a227a63375f",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
        type: "Point",
      },
      images: [
        {
          url: "https://res.cloudinary.com/dv7mijkmq/image/upload/v1690453935/YelpCamp/fnxmd9yy92lkelaai7d6.png",
          filename: "YelpCamp/fnxmd9yy92lkelaai7d6",
        },
        {
          url: "https://res.cloudinary.com/dv7mijkmq/image/upload/v1690453936/YelpCamp/hrd19z3k3dppna4axumf.png",
          filename: "YelpCamp/hrd19z3k3dppna4axumf",
        },
        {
          url: "https://res.cloudinary.com/dv7mijkmq/image/upload/v1690453936/YelpCamp/k8ykr6h7ylk6ewxhqeav.png",
          filename: "YelpCamp/k8ykr6h7ylk6ewxhqeav",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium vel, sunt, architecto iure perferendis tenetur quas inventore iusto nam accusamus dicta quis eveniet eligendi maxime laborum? Aliquam quis ullam impedit?",
      price: `${price}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
