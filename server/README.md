# Homeflix Server

## Project Setup

1. Install all necessary dependencies: `npm install`
2. Run the node server: `node server` or `node server.js`
  - Runs server on port `3000`
3. For first time setup with new database, go to `http://localhost:3000/initializedb` 

## Server Routes

|     Route      | Method |                Params                |                                                           Description                                                           |
| -------------- | ------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| /addUserHandle | GET    | String: username                     | Temprorary route used to add user to sync table.                                                                                |
| /isUserHandle  | POST   | String: username                     | Checks if user is registered in sync table.                                                                                     |
| /login         | POST   | String: username<br>String: password | Takes username and password, authenticates and returns status.                                                                  |
| /signup        | POST   | String: username<br>String: password | Takes new username and password, checks if username is unique, creates new user and/or returns status.                          |
| /upload        | POST   | File in request header               | Checks if file was uploaded, generates name and thumbnail, encrypts and stores in video storage.                                |
| /video:id      | GET    | int: id                              | Looks up video based on id requested, retrieves path, decrypts the video and streams it to the client based on requested range. |
| /videos        | GET    | None                                 | Looks up all available videos in database.                                                                                      |
| /activeVideos  | GET    | None                                 | Looks up all currently watched videos from sync table.                                                                          |
| /getip         | GET    | None                                 | Returns server ip address.                                                                                                      |
| /initializedb  | GET    | None                                 | Initializes database, creates tables.                                                                                           |
| /addSync       | POST   | String: user<br>int: id              | Store user, video title and video id in sync table.                                                                             |
| /removeSync    | POST   | String: user<br>int: id              | Removes entry from sync table based on user and video id.                                                                       |

## Video Streaming

Clients will request a video by id and the path is looked up in the videos database. Based on the retrieved path, copy it to the staging folder and decrypt. If the client did not send a range value, return the video length and format. If they did send a range, use the range to extract next video data chunk and stream it to the client. Wipe staging folder once data has been streamed.

![Video Streaming](https://i.imgur.com/GqKKj5b.png)<br>
Figure 1: Annotated flow diagram of video streaming process

## Video Encryption/Decryption

Files are encrypted using AES-256 encryption with the [file-encrypt](https://www.npmjs.com/package/file-encrypt) node package. When new videos are uploaded to the server, they are stored in a temporary staging folder. Here, the thumbnails and paths are generated and then the video is encrypted and put into storage. When a video is requested to be played, it is copied to the staging folder and decrypted. The required chunk is extracted and streamed to the client. After each step, the staging folder is wiped.

![Video Encryption](https://i.imgur.com/8bfvhU8.png)<br>
Figure 2: Annotated flow diagram of video encryption process

## Sync Streaming

Clients will report their currently watched videos to the server, along with their user id and time. When another client loads their homepage, they will see the first clients video under the now watching section. The second client can then start watching along with the first and their video time will be kept in time with the host. If the host pauses the video or skips, the synced client will do the same. If the synced client wants to desync, they can uncheck the sync slider.

![Video Sync](https://i.imgur.com/SfjMDKo.png)<br>
Figure 3: Annotated flow diagram of sync streaming process
