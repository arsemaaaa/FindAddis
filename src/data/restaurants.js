// sample/mock restaurants data for local development
const SAMPLE_RESTAURANTS = [
  {
    id: "r1",
    name: "Lucy Ethiopian Kitchen",
    category: "Ethiopian",
    rating: 4.6,
    price: "$$",
    address: "Bole, Addis Ababa",
    images: ["https://source.unsplash.com/collection/190727/800x600"],
    hours: "08:00 - 23:00",
    description: "Classic Ethiopian dishes served family-style.",
    menu: ["Doro Wat", "Tibs", "Shiro"],
    reviews: [
      { id: "v1", user: "Marta", rating: 5, text: "Amazing flavours!", date: "2025-10-10" },
    ],
  },
  {
    id: "r2",
    name: "Italiano Corner",
    category: "Italian",
    rating: 4.2,
    price: "$$$",
    address: "Kazanchis, Addis Ababa",
    images: ["https://source.unsplash.com/collection/1424340/800x600"],
    hours: "11:00 - 22:00",
    description: "Wood-fired pizzas and homemade pasta.",
    menu: ["Margherita", "Carbonara"],
    reviews: [],
  },
  {
    id: "r3",
    name: "Addis Cafe",
    category: "Cafe",
    rating: 4.0,
    price: "$",
    address: "Piassa, Addis Ababa",
    images: ["https://source.unsplash.com/collection/1114848/800x600"],
    hours: "07:00 - 20:00",
    description: "Cozy spot for coffee and light bites.",
    menu: ["Coffee", "Pastries", "Sandwiches"],
    reviews: [{ id: "v2", user: "Sam", rating: 4, text: "Nice coffee and calm place.", date: "2025-09-21" }],
  },
];

export default SAMPLE_RESTAURANTS;
