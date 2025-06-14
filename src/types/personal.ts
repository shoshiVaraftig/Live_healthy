import PersonalArea from "../components/PersonalArea" ;
export interface PersonalArea 

{
  "id": 0,
  "username": "string",
  "password": "string",
  "email": "string",
  "phone": "string",
  "gender": 0,
  "birthDate": "2025-06-10T07:24:06.790Z",
  "programLevel": 0,
  "startWeight": 0,
  "goalWeight": 0,
  "goalDate": "2025-06-10T07:24:06.790Z",
  "startDate": "2025-06-10T07:24:06.790Z",
  "weightTracing": {
    "id": 0,
    "userId": 0,
    "weight": 0,
    "date": "2025-06-10T07:24:06.790Z"
  },
  "height": number,
  "dietaryPreferences": {
    "id": number,
    "userId": number,
    "foodName": string,
    "like": string,
  }[],
  "chatPersonality": string
}