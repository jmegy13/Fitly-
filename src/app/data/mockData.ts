export type MockPhoto = {
  id: string;
  image: string;
  label: string;
};

export type ClothingItem = {
  id: string;
  image: string;
  name: string;
  price: string;
  brand: string;
  category: string;
};

export type SavedOutfit = {
  id: string;
  image: string;
  title: string;
  date: string;
  isFavorite: boolean;
};

export const examplePhotos: MockPhoto[] = [
  {
    id: 'studio',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&q=85',
    label: 'Studio portrait',
  },
  {
    id: 'street',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&q=85',
    label: 'Street portrait',
  },
  {
    id: 'casual',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=85',
    label: 'Casual portrait',
  },
];

export const clothingItems: ClothingItem[] = [
  {
    id: 'leather-jacket',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=700&q=85',
    name: 'Black Leather Jacket',
    price: '$299',
    brand: 'Astra Atelier',
    category: 'Jackets',
  },
  {
    id: 'summer-dress',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=85',
    name: 'White Summer Dress',
    price: '$159',
    brand: 'Luna Studio',
    category: 'Dresses',
  },
  {
    id: 'denim-jacket',
    image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=700&q=85',
    name: 'Denim Jacket',
    price: '$189',
    brand: 'Northline',
    category: 'Jackets',
  },
  {
    id: 'striped-tee',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85',
    name: 'Striped T-Shirt',
    price: '$49',
    brand: 'Everyday Form',
    category: 'Tops',
  },
  {
    id: 'knit-sweater',
    image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=700&q=85',
    name: 'Knit Sweater',
    price: '$129',
    brand: 'Softline',
    category: 'Knitwear',
  },
  {
    id: 'bomber-jacket',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&q=85',
    name: 'Bomber Jacket',
    price: '$249',
    brand: 'Modehaus',
    category: 'Jackets',
  },
];

export const savedOutfits: SavedOutfit[] = [
  {
    id: 'summer-look',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=85',
    title: 'Summer Look',
    date: '2 days ago',
    isFavorite: true,
  },
  {
    id: 'street-style',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&q=85',
    title: 'Street Style',
    date: '1 week ago',
    isFavorite: true,
  },
  {
    id: 'casual-friday',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f8cf6?w=700&q=85',
    title: 'Casual Friday',
    date: '2 weeks ago',
    isFavorite: false,
  },
  {
    id: 'night-out',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=85',
    title: 'Night Out',
    date: '3 weeks ago',
    isFavorite: true,
  },
  {
    id: 'office-chic',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=700&q=85',
    title: 'Office Chic',
    date: '1 month ago',
    isFavorite: false,
  },
  {
    id: 'weekend-vibes',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=85',
    title: 'Weekend Vibes',
    date: '1 month ago',
    isFavorite: false,
  },
];

export const defaultTryOn = {
  selfie: examplePhotos[0],
  clothing: clothingItems[0],
  resultImage: examplePhotos[1].image,
};
