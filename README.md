# Synths Mini-Market

## Description

Responsive e-commerce web application dedicated to the synthesizers sell.

In this application built with the MERN stack (i.e. MongoDB, Express, React, Node.js), the customer is able to pick-up a product and go through a classic checkout process to buy it. Paypal and Stripe payment methods are implemented. The app also features a register / login system (JWT web tokens), a profile interface, an administrator interface, etc.

## Customer screens
<p float="left">
  <img src="/app-images/productsscreen.png" width="300" alt="Products screen" />
  <img src="/app-images/productdetailsscreen.png" width="300" alt="Product details screen" />
  <img src="/app-images/cartscreen.png" width="300" alt="Cart screen" />
  <img src="/app-images/orderstatusscreen.png" width="300" alt="Order status screen" />
  <img src="/app-images/profilescreen.png" width="300" alt="Profile screen" />
</p>

## Admin screens
<p float="left">
  <img src="/app-images/adminproductslistscreen.png" width="300" alt="Admin products list screen" />
  <img src="/app-images/admineditproductscreen.png" width="300" alt="Admin product edit screen" />
  <img src="/app-images/adminuserslistscreen.png" width="300" alt="Admin users list screen" />
  <img src="/app-images/adminorderslistscreen.png" width="300" alt="Admin orders list screen" />
</p>

## What I've learnt?

- Building a full-stack app from scratch using the MERN stack
- Constructing a CRUD API with Node.js, Express and MongoDB (routes, controllers, middlewares, database...)
- Creating a coherent front-end with different vues and routes (React and React Router DOM)
- Working with Redux to globally manage component states
- Implementing a register / login system with the help of JWT web tokens
- Displaying different vues and functionalities based on user id (administrator interface / customer interface)
- Implementing payment methods: Paypal and Stripe
- Deploying on Heroku

## Possible improvements

- I spent a lot of time creating my own components (too much in my opinion) which means writing a lot of CSS which was a bit cumbersome as I would have prefer to stay more focused on back-end development. I built all the components of this app by myself except the loading spinner. For future project I plan to use Tailwind CSS.
- The carousel component is a bit glitchy and I've no clue about why.
- I used Formik to manage forms validation and got frustrated by some lack of documentation. I plan to use React Hook Form instead in a near future.
- I used GSAP for scroll triggering effects and got unexpected behaviour which was also frustrating.
- I also had some bugs with React Router DOM. Frustration again.
- Not sure about the way the checkout process is structured.
- The app is not really finished but I just want to move on something else and apply what I've learned through this project on the next.
