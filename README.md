# WEB103 Project 2 - *Lantern List*

Submitted by: **Mithun Venkatesh Gowda**

About this web app: **Lantern List is a field guide to eight night markets and night food streets in Taipei, Bangkok, Hong Kong, and Seoul. Each stop shares the same details — name, city, region, specialty, hours, price, vibe, and a photo — so you can browse the list and open a page for every market.**

Time spent: 2 hours

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured database table for the list items**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**


The following **optional** features are implemented:

- [x] The user can search for items by a specific attribute

The following **additional** features are implemented:

- [x] Filter the list by region (Taiwan, Thailand, Hong Kong, South Korea)
- [x] Each market has a detail view at `/markets/:slug`, and unknown paths show a 404 page
- [x] Markets are shown as cards and the page is styled with Pico CSS

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='project_walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with [Kap](https://getkap.co/)

## Notes

Put the database settings in `server/.env`: `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, and `PGDATABASE`.

1. Open a terminal and navigate into the `client` directory.
2. Run the command `npm install` to install the required dependencies for the `client`.
3. Run the command `npm run dev` to run the frontend.
4. Open a **new** terminal and navigate into the `server` directory.
5. Run the command `npm install` to install the required dependencies for the `server`.
6. Run the command `npm run seed` once to create and fill the `markets` table.
7. Run the command `npm run start` to run the backend.

Open [http://localhost:5173](http://localhost:5173).

The page is a Vite app in `client/` and uses HTML, CSS, and JavaScript. Vite serves the page on port 5173 and forwards `/api` to the Express server on port 3001. Express reads the `markets` table in the Render Postgres database. `npm run seed` inside `server/` runs `server/db/schema.sql` and `server/db/seed.sql`.

Search filters the `specialty` column. Region chips filter the `region` column. Both happen in SQL. Detail routes follow `/markets/:slug`. An unknown slug, such as `/markets/not-a-market`, and any other unknown path show the 404 page. Photos are stored in `client/public/images` and come from Unsplash.

## License

Copyright 2026 Mithun V Gowda

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
