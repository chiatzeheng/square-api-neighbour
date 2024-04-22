export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} | null;

export interface User {
  imageUrl: string;
  firstName: string;
  lastName: string;
  emailAddresses: string;
}

export interface Business {
  businessID: string;
  images: string[];
  name: string;
  description: string;
  category: string;
  squareAccountID: string;
}

export interface Location {
  locationID: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface AR {
  arID: number;
  name: string;
  description: string;
  category: string;
  creatorID: number;
  createdDate: Date;
}

export interface ARExperienceData {
  arID: number;
  key: string;
  value: string;
}

export interface ARBusiness {
  arID: number;
  businessID: number;
}

export interface Product {
  productID: number;
  name: string;
  images: string[];
  description: string;
  price: number;
  category: string;
  businessID: number;
  isVirtual: boolean;
}

export interface Transaction {
  transactionID: number;
  userID: number;
  productID: number;
  transactionDate: Date;
  amount: number;
  paymentMethod: string;
  squarePaymentID: string;
}

export interface TransactionBusiness {
  transactionID: number;
  businessID: number;
}

export interface Content {
  contentID: number;
  contentType: string;
  userID: number;
  businessID: number;
  content: string;
  createdDate: Date;
}
