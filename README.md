# Express Blog

## Team

- Шевчук Владислав
- Гудзь Ваня
- Лисюк Максим
- Олійник Дмитро

## Routes

### Authorization

- POST /auth/register - Register new user
- POST /auth/login - Login existing user with username & password
- GET /auth/me - Check token and return user data

### Users

- POST /users/:userId/follow - Follow or unfollow user
- GET /users/:userId - Get user data
- PUT /users/:userId - Update authorised user profile
- DELETE /users/:userId - Delete authorised user profile

### Posts

- GET /posts - Get all posts with sorting(likes, views, createdAt), filtering, pagination
- GET /posts/:postId - Get post data with comments
- POST /posts - Create post
- PUT /posts/:postId - Update post
- DELETE /posts/:postId - Delete post
- PATCH /posts/:postId/like - Like post
- PATCH /posts/:postId/save - Add post to reading list

### Tags

- GET /tags - Get all tags with search filtering

### Comments

- POST /comments - Create new comment for the post
- PUT /comments/:commentId - Edit existing comment by it's author
- PATCH /comments/:commentId - Delete existing comment

## Models

[DB Schema Design](https://lucid.app/lucidchart/50c69055-66e7-482c-9576-3c2c8baab6bc/edit?invitationId=inv_5211d781-e4bb-404a-b36b-7f9a097e76f6&page=0_0#)

## Packages

- nodemon
- express
- mongoose
- cors
- helmet
- dotenv
- yup
- volleyball
- passport
- passport-jwt
- bcryptjs
- jsonwebtoken
