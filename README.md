# Live-Meetings-Events-Sample
Live Q&amp;A and Polls for your Meetings &amp; Even


# Clone project

```
$ git clone https://github.com/hoangdackien/Live-Meetings-Events-Sample.git
$ cd Live-Meetings-Events-Sample
```

## Install & Start Server

```
$ cd server
$ npm install
$ npm start
```

## Install & Start Client

```
$ cd client
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).


## Features</a>
+ Uses ReactJS, Express as the application Framework.   
+ Real-time communication between a client and a server using [Socket.io](https://github.com/socketio/socket.io).
+ Multiple rooms events with code
+ Included Admin/Audience Role
+ Edit/Delete/Highlight Message by admin role
+ Free to post message by audience role
+ Like/Unlike message
+ Sort by like/created time.
+ Responsive with bootstrap 3

## TODO
+ Authenticates via SSO social username and password as google, twitter, facebook..
+ Manages sessions login 
+ Reconnect after disconnect
+ Limit pool connection every room
+ Store Message 
+ Improve UI/UX
+ Unit test 
+ ...