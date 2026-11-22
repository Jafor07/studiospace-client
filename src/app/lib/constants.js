import {
  LuCamera,
  LuClapperboard,
  LuMic,
  LuMusic,
  LuPalette,
} from "react-icons/lu";

// Photos are free to use from Pexels. "fallback" is our own illustration, shown if a photo fails to load.
// "value" is what is saved in MongoDB. "label" is what visitors read.
export const CATEGORIES = [
  {
    value: "Photo Studio",
    label: "Photo Studios",
    blurb: "Cyc walls, daylight and strobe-ready sets",
    icon: LuCamera,
    art: "https://images.pexels.com/photos/4123848/pexels-photo-4123848.jpeg?auto=compress&cs=tinysrgb&w=900",
    fallback: "/studios/photo-a.svg",
  },
  {
    value: "Film Stage",
    label: "Sound Stages",
    blurb: "Big floors, lighting grids and blackout walls",
    icon: LuClapperboard,
    art: "https://images.pexels.com/photos/6621416/pexels-photo-6621416.jpeg?auto=compress&cs=tinysrgb&w=900",
    fallback: "/studios/film-a.svg",
  },
  {
    value: "Podcast Lounge",
    label: "Podcast Rooms",
    blurb: "Treated rooms with broadcast-ready mics",
    icon: LuMic,
    art: "https://images.pexels.com/photos/7450049/pexels-photo-7450049.jpeg?auto=compress&cs=tinysrgb&w=900",
    fallback: "/studios/podcast-a.svg",
  },
  {
    value: "Music Suite",
    label: "Music Suites",
    blurb: "Control rooms, live rooms and monitors",
    icon: LuMusic,
    art: "https://images.pexels.com/photos/7087606/pexels-photo-7087606.jpeg?auto=compress&cs=tinysrgb&w=900",
    fallback: "/studios/music-a.svg",
  },
  {
    value: "Workshop",
    label: "Art Workshops",
    blurb: "Easels, benches and bright working light",
    icon: LuPalette,
    art: "https://images.pexels.com/photos/8191551/pexels-photo-8191551.jpeg?auto=compress&cs=tinysrgb&w=900",
    fallback: "/studios/workshop-a.svg",
  },
];

export const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Air conditioning",
  "Power backup",
  "Parking",
  "Green room",
  "Makeup station",
  "Changing room",
  "Restroom",
  "Kitchenette",
  "Backdrops and paper",
  "Softboxes and strobes",
  "Blackout curtains",
  "Soundproofing",
  "Mixing console",
  "Microphones included",
  "Props and furniture",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

// Half-hour start times from 6:00 AM to 10:30 PM
export const TIME_SLOTS = Array.from({ length: 34 }, (_, index) => {
  const minutes = 6 * 60 + index * 30;
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  return `${hours}:${minutes % 60 === 0 ? "00" : "30"}`;
});
