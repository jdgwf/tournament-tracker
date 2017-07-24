#Tourmnent Tracker
##Purpose
Application for tracking and scoring various Miniature Wargame Tournaments

## Team
Jeffrey D. Gordon ( [@gauthic](https://twitter.com/gauthic/) ), Lead Developer and designer

## License
This project is licensed under the terms of the MIT license.


## Development
### Technology
This application is an Angular Javascript application that allows a user to create and run miniature wargame tournaments from any device with access to a modern web browser.

The tools are powered by HTML, Foundation 6 and AngularJS. All data and logic are then compiled and handled by grunt via npm.

There are no server moving parts for the application itself, but I'm seeing a need for at least exporting of the data to and from the application itself between devices.

### What is done
* Modified my custom CSS app framework for Tournament Tracker (including multilanguage support)
* Added functions to add, edit, delete, import, and export players
* Added functions to add, edit, delete, import, and export tournaments
* "Start" a tournament. This includes setting up a grid - Simple Tournaments work well on a phone sized sreen.
* Handle scoring of tournament round in real time.
* Manual Match Swap now works - at this point the app should be usable and semi-automatic.
* Filtering / Searching Players in both select and edit screens.
* All Matchup options should be working

### What is currently on the dev plate
* Bye is Average Calculations (steamroller will have to average Army and Control points)

### What needs to be done
* Add "complete tournament" with a PDF export of the results.
testing, bugfixing, testing, and **BUGFIXING**
* Multi-device syncing using the Google Drive API.

### Things on the horizon
* Ability to open a "Matchups Table" window that's worthy of putting up on a external TV or Projector.
* Create a PDF 4-per-page Tournament Results handout for printing for the options set per tournament
Timer, timed tournaments. Right now I assume that the Tourmament Manager will be handling this on his/her own device.
