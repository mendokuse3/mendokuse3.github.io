$(() => {

    // make a loop for how many targets are needed outside create interval and put inside an arary
    // inside interval, append target to play area using the array
   

// VARIABLES
    const $introModal = $('#intro-modal');
    const $closeIntro = $('#close-intro');
    const $gamezone = $('#play-area');
    const $gameOverModal = $('#game-over-modal');
    const $closeGameOver = $('#close-game-over');
    const $roundOverModal = $('#round-over-modal');
    const $startNewRound = $('#start-new-round');
    const $rulesModal = $('#rules-modal');
    const $closeRules = $('#close-rules');
    const $score = $('#score');
    const $missCounter = $('#miss-counter');
    const $remainingTargets = $('#remaining-targets');
    const $round = $('#round');
    let time = 30;
    let timer;
    let score = 0;
    let missCounter = 0;
    let round = 1;
    let targetDuration = 2;
    let interval = 1;
    let remainingTargets = {
        val: 5,
        min: 0,
        removeTarget() {
            if(this.val > 0){
                this.val --;
            } else {
                this.val = 0;
            }
            return this.val;
        }
    }
    let ranOutOfTime = false;
    const pestArray = [
        "https://cdn.pixabay.com/photo/2013/07/13/10/26/snail-157212_1280.png", "https://cdn.pixabay.com/photo/2012/04/02/14/24/hungry-worm-24634_1280.png", "https://cdn.pixabay.com/photo/2013/07/13/10/15/cockroach-156887_1280.png"  
    ]
    let keyArray = [];
    let generateTarget;
    let targetTimeout;
    let testArray = [];
    let targetArray = [];
    let deadTarget;
    const $roundTime = $('#time').text(time);
    
    
    // FUNCTIONS
    const countDownTime = () => {
        timer = setInterval(function() {
            time --;
            // console.log(time);
            
            $roundTime.text(time)
            if(time <= 0){
                $roundTime.css('font-size', '23px');
                $roundTime.text('TIME IS UP');
                ranOutOfTime = true;
                // remove event listeners within play zone once time is up  
                clearInterval(timer);
                gameOver();
                clearInterval(generateTarget);
            }
        }, 1000);
    }

    const resetTimer = () => {
        time = 30;
        clearInterval(timer);
        countDownTime();
    }

    const updateInfo = () => {
        $score.text(score);
        $missCounter.text(missCounter);
        $remainingTargets.text(remainingTargets.val);
        $round.text(round);
    }

    //  randomizes  x and y coordinates of target
    const randomLocationX = () => {
        // for both x and y, the first target locatin is always at origin because .target.width is undefined/nan at the first one becasue it has not been appended
        // if all targets on screen are clicked and there are stilll more targets, next one will always be at origin
        // this is solved by creating a div in html with target class and setting display none;
        //  or by setting img size to a standart 40 px, can randomize.
        // const width = Math.random() * ($gamezone.width() - 40);
        const width = Math.random() * ($gamezone.width() - $('.target').width());
        return width;
    }
    const randomLocationY = () => {
        // const height = Math.random() * ($gamezone.height() - 40);
        const height = Math.random() * ($gamezone.height() - $('.target').height());
        return height;
    }

     // makes targets unclickable after time is up or miss too many
     const stopTargets = () => {
        $('.target').off();
    }

    // game over modal
    const gameOver = () => {
        clearInterval(timer);
        clearTimeout(targetTimeout);
        clearInterval(generateTarget);
        stopTargets();
        $gameOverModal.css('display', 'block');
        
    }

    // round over modal
    const roundOver = () => {
        clearTimeout(targetTimeout);
        clearInterval(generateTarget);
        clearInterval(timer);
        stopTargets();
        $roundOverModal.css('display', 'block');
    }

    // removes target on click
    const clickTarget = (event, name) => {
        const target = $(event.currentTarget);
        // clicking on image will remove the div and add a point to score while decrementing target left
        // increment score and decrement targets left
        score += 100;
        remainingTargets.removeTarget();
        updateInfo();
        keyArray.push(target.attr('id'));
        // console.log(typeof target.attr('id'));
        // console.log(target.attr('id'));
        
        // console.log(keyArray);

        
        target.remove();
        // console.log(target);
        
        // if(remainingTargets.val === 0){
        //     clearInterval(timer);
        // }
    }


// GAME LOGIC

const createTargetArray = () => {
    for (let i = 0; i < remainingTargets.val; i++){
        let x = Math.floor(Math.random() * (pestArray.length));
        let randomName = Math.floor(Math.random() * 20000);
        const target = $('<div>').addClass(`target`).attr('id', `key-${randomName}`);
        target.css('background-image', `url(${pestArray[x]}`);
        target.css({
            'top': `${randomLocationY()}px`,
            'left': `${randomLocationX()}px`
        });
        target.on('click', clickTarget);
        targetArray.push(target);
        testArray.push(target);
    }
}

const startGame = () => {
    // let generatingArray = targetArray;
    // console.log(targetArray);
    generateTarget = setInterval(function() {
        if (round > 1) {
            gameOver();
        }
        $gamezone.append(targetArray[0]);
        deadTarget = targetArray.shift();
        destroyTarget(deadTarget);
        
        // console.log(targetArray.length);
        
        if(targetArray.length === 0){
            $(`#${testArray[testArray.length-1].attr('id')}`).on('click', roundOver);
            // targetArray[0].on('click', roundOver)
            clearInterval(generateTarget);
        }
        
    }, (interval*1000));
}

const destroyTarget = (thing) => {
    // console.log(typeof thing.attr('id'));
    // console.log(thing.attr('id'));
    targetTimeout = setTimeout(function() {
        if(keyArray.includes(thing.attr('id')) === false){
        // console.log('destroyed');
            // console.log(keyArray.includes(deadTarget.attr('id')));
            missCounter++;
            if(missCounter > 2){
                gameOver();
            }
            remainingTargets.removeTarget();
            updateInfo();
            thing.remove()
        }
    }, (targetDuration * 1000))
    // let destroyingArray = array;
    // let missedTarget = destroyingArray[0].attr('id');
    // v++;
    // console.log(destroyingArray[0].attr('id'));
    // console.log(v);
    // console.log(deadTarget);
    
    // deadTarget.remove();
    
    // $(`#${missedTarget}`).remove();
    // destroyingArray.shift();
    // console.log('destroy');
    
}
// $('#rules').on('click', destroyTarget)

// Logic for generating targets
// const createTargets = () => {
//     let i = remainingTargets.val;
//     let randomName;
//     generateTarget = setInterval(function() {
//         let x = Math.floor(Math.random() * (pestArray.length));
//         randomName = Math.floor(Math.random() * 20000);
//         const target = $('<div>').addClass(`target`).attr('id', `key-${randomName}`);
//         target.css('background-image', `url(${pestArray[x]}`);
//         target.css({
//             'top': `${randomLocationY()}px`,
//             'left': `${randomLocationX()}px`
//         });

//         target.on('click', (event) => {
//             clickTarget(event, randomName);
//         });

//         const targetDur = () => {
//             return new Promise(function (resolve, reject) {
//                 targetTimeout = setTimeout(resolve, (targetDuration * 1000));
//             }).then((data) => {
//                 if (testArray.indexOf(randomName) === -1) {
//                     // if(testArray.indexOf(randomName) === -1) {
//                         console.log(randomName);
//                         console.log('esererer', testArray);
                        
                        
//                         target.remove();
//                         missCounter++;
//                         remainingTargets.removeTarget();
//                         updateInfo();

                    
//                     // if a target is missed and then the next one is not missed, it is counted as if missed
//                     // console.log(remainingTargets.val);
//                 }
//             });
//         }
        
        
//         $gamezone.append(target);
//         targetDur();
        
//         i --;

//         if(missCounter > 2){
//             console.log('i just ran before game over');
            
//             gameOver();
//         }

//         if(i<=0){
//             clearInterval(generateTarget)
//         }
//         if(i <= 0){
//             $(`#key-${randomName}`).on('click', () => {
//                 console.log('i just ran before roundover');
                
//                 roundOver()
//             })
//         } 
        
//     }, (interval*1000));
// }


// EVENT HANDLERS
$closeIntro.on('click', () => {
    $introModal.hide();
    createTargetArray();
    startGame();
});
// starts timer once intro is closed
$closeIntro.on('click', countDownTime);

$closeGameOver.on('click', () => {
    $gameOverModal.hide();
})

$startNewRound.on('click', () => {
    $roundOverModal.hide();
    missCounter = 0;
    remainingTargets.val = 5;
    round ++;
    targetDuration -= .5
    keyArray = [];
    testArray = [];
    targetArray = [];
    resetTimer();
    updateInfo();
    createTargetArray();
    // countDownTime();
    startGame();

})

$rulesModal.on('click', () => {
    $rulesModal.show();
})

$closeRules.on('click', () => {
    $rulesModal.hide();
})







// on opening, have modal that displays intro
    

   


// timer on top
    // simply counts down from variable time, which by default
    // will be a set amount of time, but can be adjusted at bottom
    

    // round timer function
    
    
    
    

    


// info area
   
    // score which will update continuously upon clicks
    // miss clicked whi ch will track expired targets and if you click on body
    // targets left will be default 20 targets, but can be set in bottom
    // round count will be default 5, but can be adjusted
    
   

    
// game area
    // 2 different arrays to pick from, of good and bad
    // maybe 1 array, with penalty being array index >= 3;
    

    // const dontClickArray = [
    //     "https://cdn.pixabay.com/photo/2014/04/03/09/58/eggplant-309459_1280.png", "https://cdn.pixabay.com/photo/2012/04/18/20/21/strawberry-37781_1280.png", "https://cdn.pixabay.com/photo/2013/07/12/18/19/tomato-153272_1280.png"
    // ]


    // const targetArray = [
    //     "https://cdn.pixabay.com/photo/2013/07/13/10/26/snail-157212_1280.png", "https://cdn.pixabay.com/photo/2012/04/02/14/24/hungry-worm-24634_1280.png", "https://cdn.pixabay.com/photo/2013/07/13/10/15/cockroach-156887_1280.png", "https://cdn.pixabay.com/photo/2014/04/03/09/58/eggplant-309459_1280.png", "https://cdn.pixabay.com/photo/2012/04/18/20/21/strawberry-37781_1280.png", "https://cdn.pixabay.com/photo/2013/07/12/18/19/tomato-153272_1280.png"
    // ]

    






   
    
    
    // math.random to randomly generate position x and position y
    // divs that pop up are absolute and contain random images which will be in an array
    // target will last a set time before removing itself
    // clicking on body will decrement score
    // after all the targets have been displayed and clicked, round is over
    // once round is over, either display button or time before next round
    
    
    
    // option area
      //could change to ms
    // rules will be a button that opens modal that explains the rules of game
    // num of popups will take input that adjusts target left in info aka max targets/round
    // popup size will take input that adjusts size of divs -> images
    // round timer will adjsut time counter at top, which stays same at each round
    // target duration affects how long target lasts
    
    
    
    
    
    
    // createTargets();

})