

//authRouter//

POST - /auth/signup
POST - /auth/login
POST - /auth/logout
PATCH/PUT - /auth/resetpassword
GET - /auth/refreshcookies


//userprofileRoutes
GET - /profiles/profiles
POST - /profiles/updateprofiles

//connectionsRoutes

Post - /connection/sendConnection/like/:userID
Post - /connection/sendConnection/dislike/:userID
Get - /connection/connectedusers
Get - /connection/viewRequests/:userID
Post - /connection/accept/requestID
Post - /connection/reject/requestID


//Feed

GET - /feed/users
GET - /feed/users/:userID //pagination



