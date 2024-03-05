## News Portal - API Documentation

### This is a api for management a news portal.
#
## Techlogies used:

 Back-End

- NodeJS
- Fastify

 Database

- Postgres (neondb)

 Libs

- JWT
- BCrypt
- DotEnv
- Colors


 Tool for tests

- Vitest


### API Routes
#

#### Auth Routes
    - [POST] /auth/login - Authenticate a user with email and password, returning a JWT.

#### Users CRUD
    - [GET] /users - Return an array of all registered users (without password and email).

    - [GET] /users/:email - Return an object of the user with the Email provided as a parameter. (without password)

    - [POST] /users/create - Create a user with name, email, password, and role id. If the role ID is less than or equal to 3, JWT validation is necessary.

    //JWT Validate is mandatory
        - [PATCH] /users/edit/:id - Edit a user with the ID provided as parameter

        - [DELETE] /users/delete/:id - Delete a user with the ID provided as parameter

#### News CRUD
    - [GET] /news - Return an array of all created news
    
    - [GET] /news/:id - Return an object of the news with the ID provided as a parameter

    - [GET] /news/user/:id - Return an object of the news created by user with the ID provided as a parameter

    //JWT Validate is mandatory
        - [POST] /news/create - Create a news article using title, description, and content
        - [PATCH] /news/edit/:id - Edit a news with the ID provided as a parameter
        - [DELETE] /news/delete/:id - Delete a news with the ID provided as a parameter.