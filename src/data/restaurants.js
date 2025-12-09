// Sample restaurants focused on popular Addis spots (local images where available)
import LucyImg from "../assets/lucy.jpg";
import ItalianoImg from "../assets/italiano.webp";
import AddisImg from "../assets/addis-cafe.jpg";

const SAMPLE_RESTAURANTS = [
  {
    id: "lucy",
    name: "Lucy Ethiopian Restaurant",
    category: "Ethiopian",
    rating: 4.6,
    price: "$$",
    address: "Bole, Addis Ababa",
    images: [LucyImg],
    hours: "08:00 - 23:00",
    description: "Traditional Ethiopian dishes served with authentic injera and a warm atmosphere.",
    menu: ["Doro Wat", "Tibs", "Shiro"],
    reviews: [
      { id: "v1", user: "Marta", rating: 5, text: "Amazing flavours!", date: "2025-10-10" },
    ],
  },
  {
    id: "tomoca",
    name: "Tomoca Coffee",
    category: "Cafe",
    rating: 4.5,
    price: "$",
    address: "Multiple locations, Addis Ababa",
    images: [Placeholder],
    hours: "07:00 - 20:00",
    description: "Historic Ethiopian coffee roaster, known for strong, aromatic brews.",
    menu: ["Ethiopian coffee", "Pastries"],
    reviews: [],
  },
  {
    id: "kategna",
    name: "Kategna",
    category: "Ethiopian",
    rating: 4.4,
    price: "$$",
    address: "Old Airport, Addis Ababa",
    images: [Placeholder],
    hours: "10:00 - 22:00",
    description: "Local favorite serving homestyle Ethiopian favorites in a relaxed setting.",
    menu: ["Kitfo", "Tibs"],
    reviews: [],
  },
  {
    id: "addiscafe",
    name: "Addis Cafe",
    category: "Cafe",
    rating: 4.0,
    price: "$",
    address: "Piassa, Addis Ababa",
    images: [AddisImg],
    hours: "07:00 - 20:00",
    description: "Cozy spot for coffee and light bites.",
    menu: ["Coffee", "Pastries", "Sandwiches"],
    reviews: [{ id: "v2", user: "Sam", rating: 4, text: "Nice coffee and calm place.", date: "2025-09-21" }],
  },
  {
    id: "italiano",
    name: "Italiano Corner",
    category: "Italian",
    rating: 4.2,
    price: "$$$",
    address: "Kazanchis, Addis Ababa",
    images: [ItalianoImg],
    hours: "11:00 - 22:00",
    description: "Wood-fired pizzas and homemade pasta (popular with locals and expats).",
    menu: ["Margherita", "Carbonara"],
    reviews: [],
  },
];

export default SAMPLE_RESTAURANTS;
