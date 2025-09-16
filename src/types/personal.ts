import PersonalArea from "../components/PersonalArea" ;
import type { Recipe } from "./recipe";
export interface PersonalArea 

{
  favoriteRecipes:{id:string, recipe:Recipe} [];
  id: 0,
  username: string,
  password: string,
  email: string,
  phone: string,
  gender: 0,
  birthDate: Date,
  programLevel: string,
  startWeight: 0,
  currentWeight: number,
  goalWeight: number,
  goalDate: Date,
  startDate: Date,
  weightTracing: {
    id: number,
    userId: number,
    weight: number,
    date: Date
  },
  height: number,
  dietaryPreferences: {
    id: number,
    userId: number,
    foodName: string,
    like: string,
  }[],
  chatPersonality: string
}