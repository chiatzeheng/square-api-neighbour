## Inspiration

Submission for Square Hackathon
The inspiration behind this project came from my friends' experience of starting a business selling authentic Singaporean Batik Fabric bracelets made by their grandmother. While their initial launch was successful due to the unique and cultural products, they faced challenges when expanding to larger platforms like Shopee and Carousell. They realized that their products gained little traction as there were cheaper alternatives from dropshipping platforms, which often compromised the meaning and heritage behind such cultural items.

This experience highlighted the gap between mainstream shopping platforms (like Amazon, Shopee, and Facebook Marketplace) and community finders (like Eventbrite and Klook). Many users, including myself, were dissatisfied with the oversaturation of low-quality products that diluted the cultural significance of certain heritage items.

## What it does

This project aims to create a marketplace-like platform where users can browse through maps to discover regional specialties or products. Businesses can display their unique products in a 3D-like AR view by uploading multiple images, which a Generative AI will process and form a 3D model from the 2D images. This feature allows businesses to truly showcase the uniqueness of their products.

## How we built it

The project was built using the following technologies:

- Cockroach DB for the database
- React Native for the frontend
- Go Backend using Mux for microservices
- Square API for payments
- Clerk for authentication
- React Query for server state management
- AWS S3 for image upload
- Three.js & WebGL for 3D rendering
- Custom React Native UI Design
- TypeScript for type safety

## Images
![small](https://github.com/chiatzeheng/square-api-neighbour/assets/101942239/9938fa2c-9d8e-4342-88df-d894695f91fe)
Home
![small (1)](https://github.com/chiatzeheng/square-api-neighbour/assets/101942239/60a4f811-8ea0-4a38-b685-8480557d70f7)
Search
![small (2)](https://github.com/chiatzeheng/square-api-neighbour/assets/101942239/cae08079-3c62-43bd-8bbe-a256334d5db9)
Product
![small (3)](https://github.com/chiatzeheng/square-api-neighbour/assets/101942239/d3d1a3b1-9a63-49a5-bc8b-ed3fac3f9671)
3D Model Created by TencentARC from 2D Images



## Challenges we ran into

One of the main challenges faced during the development process was working with the Go backend. This was my first time building a backend in a language other than JavaScript/TypeScript, and Go taught me many low-level concepts that I had to experience and learn first-hand. Dealing with strict types and learning the intricacies of the language was a valuable learning experience.

Towards the end my Square Checkout stopped working due to compatibility issues with Expo while i tried to migrate from S3 to Squares and Due to time constraints i was not fully able to show the whole application. However, I thoroughly enjoyed using square as even though there was a lack of documentation for React Native, I enjoyed learning and using it and believe that its a strong product.

## Accomplishments that we're proud of
**What We Learned**

Throughout the development journey of Neighbors, several key learnings emerged:

1. **Technical Proficiency**: The project provided an opportunity to deepen our understanding and proficiency in a diverse range of technologies, from backend development using Go to leveraging cutting-edge AI models for generating 3D content.
3. **User-Centric Design**: Crafting a seamless user experience was paramount in Neighbors' development. This endeavor reinforced the importance of empathizing with users' needs and preferences, driving our focus towards user-centric design principles.

**What's Next for Neighbors**

Looking ahead, the journey for Neighbors is brimming with exciting possibilities:

1. **Expansion and Scaling**: Usage of Square's Inventory API to replace S3
