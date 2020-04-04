# Garden Defence
## A Way to Test Your Reaction Time and Mouse Control!

## Project Link

[Garden Defence](https://mendokuse3.github.io)

## Technologies Used

* HTML5
* CSS
* Javascript
* jQuery

## The Game 

This game is essentially a computerized version of whack-a-mole, but also draws from aim training maps found in games such as Counter-Strike: Global Offensive.  In this version, targets pop up at random and you have to click each one before it disappears.  At the start, there are options to customize the settings of the game.

[Whack-a-mole](https://en.wikipedia.org/wiki/Whac-A-Mole) is a game that most people have played at some point in their lives.  Moles pop up from holes at random and you have to hit each one before it goes back down. 

## Challenges
- Had a hard time figuring out a way to get targets to simultaneously be loading while having a timer on each to disappear after a set time.
- Struggled with an issue where when no targets were loaded, the next target would always appear at the same spot
- Had issues with the round automatically ending once the last target had loaded
- Had problems where while targets were not missed, it was being counted as though they had not been clicked

## Future Goals
- To add the ability to pull targets from another array where if clicked, user gets penalized, and randomly switch between good and bad targets
- To clean up logic so that the once the game ends successfully, it occurs without triggering the next round before it
- To increase difficulty by making it so that clicking on the play area due to missing a target will penalize the player
- To add audio to the game, such as a noise for successfuly clicking a target or for finishing a round