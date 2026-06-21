// ==========================================================================================
// Інтерфейс для типізації рецепта
// ==========================================================================================
//   "_id": "686f6e9ac1d1a4f95c0ea411",
//   "title": "Herb Chicken Bowl",
//   "category": "Chicken",
//   "owner": "686f6e9ac1d1a4f95c0ea111",
//   "area": "Ukrainian",
//   "instructions": "Cook chicken, slice vegetables, combine and serve.",
//   "description": "Protein-rich bowl with fresh herbs and lemon dressing.",
//   "thumb": "https://example.com/images/chicken-bowl.jpg",
//   "time": "30",
//   "ingredients": [
//     {
//       "id": "64f1234567890abcdef1234",
//       "measure": "200g"
//     }
//   ],
//   "createdAt": "2026-06-13T10:20:00.000Z",
//   "updatedAt": "2026-06-13T10:20:00.000Z"

// ==========================================================================================
export interface Recipe {
  _id: string;
  title: string;
  category: string;
  owner: string;
  area: string;
  instructions: string;
  description: string;
  thumb: string;
  time: string;
  calories: string;
  ingredients: {
    id: string;
    measure: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
