# RPS--Multiplayer
A multiplayer app for Rock Paper Scissors game

### Overview

This is a Rock Paper Scissors game that is an online multiplayer game, all with the help of Firebase and the necessary web development elements.

### Game Design Setup

* The game will match two hand choices at a time. Flags are set up so that the game can keep track of when the player picks a choice and if another player has made one to pair with for the round/match. Once a round or match is decided, the database will be cleared to make way for another round of hand choices. Basically, the first two hand choices that gets fired up will be paired together. This serves the multiplayer functionality of the game. 

* Both players pick either `rock`, `paper` or `scissors` by clicking on the corresponding images. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

* The game will track each player's wins, losses and ties.

* There is a chat functionality in this game. No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

* Styling and theme is simple. There is a message board added so all instant messages will be posted, who has handed a hand choice and who the winner/loser is or if it is a tie. Because of the simplicity of the styling, sound effects have been added and an intro music.

*The scope of the project is that it assumes the game will be played in a "perfect" scenario in which everybody just takes turns and picks a hand one after the another . As a future development, will look into situations when players choose a hand at the same time, or when players have the same names.
