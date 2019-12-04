# Homeflix Client

## Project setup
1. Install all necessary dependencies: `npm install`
2. Serve the development environment application: `npm run serve`
3. Use the `local` or `network` address to use application

Recommended: Use `network` address if you want to allow other devices on the same LAN to access the application

## Global State

The application makes use of a global state to keep track of 2 major data values:

|   Data   |                                                     Description                                                     | Immutable |
| -------- | ------------------------------------------------------------------------------------------------------------------- | --------- |
| serverIP | The current network IP, used to ensure applications running on external devices are able to connect with the server | Yes       |
| userId   | Holds the user handle entered by the user. This is used in various components requiring the identity of the user    | No        |

## View Routes

|           Name            |  Path   |                                                 Params                                                 | Component |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------------------ | --------- |
| Home                      | /       | none                                                                                                   | Home      |
| Video (Library)           | /video  | id: id of video <br> title: title of video                                                             | Video     |
| Video (Sync/Watching Now) | /video  | user: user handle of user currently watching the video <br> id: id of video <br> title: title of video | SyncVideo |
| Upload                    | /upload | none                                                                                                   | Upload    |

|           Name            |                                                                                                                                     Description                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                      | Home component acts as parent component to the Library and Watching Now sections                                                                                                                                                                                                    |
| Video (Library)           | Video view after selecting video from the Library section of the Home page. Used to initiate video sync up for the future using the video id and user id                                                                                                                            |
| Video (Sync/Watching Now) | Video view after selecting video from the Watching Now section of the Home page. Uses user id and video id stored for the video emitting a sync time to create a sync video stream. Video will allow for a +/- 4 second drift, and toggle for desyncing from original video stream. |
| Upload                    | View used to upload video files as a user                                                                                                                                                                                                                                           |

## Video Syncing
Video Sync is created using:
- Web Sockets (https://socket.io/)
- TaffyDB (http://taffydb.com/)
    - Creates an in-memory database

Users may watch a video from the Library section, leading to their current video time being emitted to the server

If any other user starts watching the video through the Watching Now section, they will be synced up with the original viewer

![Video Sync](https://i.imgur.com/3jqudPF.png)<br>
Figure 1: Flow of Video Sync feature, image located within client/assets

## Chat

Chat uses Web Sockets to emit and capture messages sent by other users watching the same video.

![](https://i.imgur.com/aTjMvRb.png)<br>
Figure 2: Flow of Chat feature, image located within client/assets
