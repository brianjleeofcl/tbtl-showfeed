# TBTL Showfeed for Reddit

This application features automatic posting from a podcast feed to Reddit using its API. It interprets `POST` requests to specific endpoints and makes `POST` requests to Reddit's API with necessary OAuth information. For the implementation of a second backend that is responsible to making the `POST` calls, look at [tbtl-showfeed-websub](https://github.com/brianjleeofcl/tbtl-showfeed-websub).

## API

### Route `/api/new-post`

**POST**: request accepts the following data in JSON:

| key | value |
|-----|-------|
| *String* title | title of the post |
| *String* description | description, part of the main text of post |
| *String* url | url, gets incorprated into main text as a link |
| *String* secret | secret, `POST` request will respond with `403 Forbidden` without the correct value |

The request will result in the server making a `POST` request to Reddit's API. The respose status to that request will be sent back in response. A Successful `POST` will create a new post on the appropriate subreddit using the values sent.

### Route `api/new-post/test`

**POST**: request does not accept any data; The request will result in the server making a `POST` request to Reddit's API. The respose status to that request will be sent back in response. A Successful `POST` will create a post on `r/test` with preconfigured title and text.

## OAuth

The application implements Reddit OAuth scheme. To initiate the auth procedure, make a `GET` request to `/OAuth/start` with a `secret` query parameter. If the secret checks out, it will redirect to a Reddit API endpoint to ask for user permission. Once permission is granted, user will be redirected to `/OAuth/redirect` where it does the following two things:

1. it requests the Reddit API for tokens
2. it redirects the user back to `r/tbtl` on Reddit.

Tokens are refreshed prior to each posting.