import { z } from "zod";

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const productsSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().min(1),
  reviews: z.array(
    z.object({
      review: z.number().min(1),
      rating: z.string().min(1),
    })
  ),
  expect: z.array(
    z.object({
      description: z.string().min(1),
    })
  ),
  instructions: z.array(
    z.object({
      text: z.string().min(1),
    })
  ),
});

export const businessSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  category: z.string().min(1),
});
