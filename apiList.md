# DevTinder API

## authRouter
-POST /signup
-POST /login
-POST /logout

## profileRouter
-GET /profile/view
-PATCH/profile/edit
-PATCH/profile/password

## connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId

## userRouter
-GET /user/requests/received
-GET user/connections
-GET user/feed -Gets you profile of other users

status:- ignore,interested,accepted,rejected