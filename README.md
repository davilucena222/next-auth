# 🔖 Next Auth

<p>
  Next Auth is an application that was developed with the best back-end practices approaches when it comes about authentication, authorization, generating tokens, refresh tokens, designated a user to a specific route, page or website. This is a approache to handle with log in, sign in, sign out and the most errors that could happen when a user interact with a website and cookies.
  
  In this application was used the cookies to save the token and refresh token data to store the user informations. The jwt token was used in this development as a way to handle with the user email, roles and permissions, this roles and permissions was necessary to handle with the user access to specific pages, also to redirect the user if not exists a token, permission or a role approved.
  
  Both client side and server side (the Next method Get Server Side Props) were used to handle with all the user events that could happen based on the user token that contains his information.
  
  You can use this template to developer your application and connecting to a database or API to consume the data.
</p>

# 🔧 Tecnologies

This project was developed with the following tecnologies:

- [React JS](https://pt-br.reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Next JS](https://nextjs.org/)
- [Axios](https://axios-http.com/ptbr/docs/intro)
- [JWT-decode](https://www.npmjs.com/package/jwt-decode)
- [Nookies](https://github.com/maticzav/nookies)
- [Broadcast Channel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [JWT Token](https://jwt.io/)

# 🚀 Features

<ul>
  <li>Redirect to specific pages and routes</li>
  <li>The best error handling for each event of log in, sign out and among others</li>
  <li>Refresh token method to expired tokens</li>
  <li>Automatic redirect users to pages and routes that is accessible for all</li>
  <li>Handling with private data</li>
  <li>Limited time to expired a token</li>
  <li>Sharing the token with all the other pages</li>
  <li>Logout user of all the other pages if make a logout in just one page</li>
  <li>if the token exists when the user access the page automatic login the user</li>
</ul>

# 💻 How to execute World Tripe on your machine

Clone the Next Auth project and access the project folder to execute the application:


```bash
  $ git clone <repository link of the project>
  # install the dependecies: run the command "yarn"
  $ run "yarn dev" to enable the server and access the localhost:3000 on your browser
```

# 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE.md) file for more details.
