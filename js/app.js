$(() => {

// VARIABLES
    const $introModal = $('#intro-modal');
    const $gamezone = $('#play-area');
    const $gameOverModal = $('#game-over-modal');
    const $closeGameOver = $('#close-game-over');
    const $roundOverModal = $('#round-over-modal');
    const $youWinModal = $('#you-win-modal')
    const $startNewRound = $('#start-new-round');
    const $rulesButton = $('#rules');
    const $rules = $('#show-rules');
    const $restartButton = $('.restart');
    const $score = $('#score');
    const $missCounter = $('#miss-counter');
    const $remainingTargets = $('#remaining-targets');
    const $round = $('#round');
    let time = 30;
    let timer;
    let score = 0;
    let missCounter = 0;
    let round = 1;
    let targetDuration;
    let interval = 1;
    let remainingTargets = {
        val: 20,
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
    
    
    const $numberInput = $('#number-input');
    const $intervalInput = $('#interval-input');
    const $roundTimeInput = $('#round-time-input');
    const $durationInput = $('#duration-input');
    const $submitAndStart = $('#submit-and-start');


    let numberInput;
    let targetDurationVal;
    let timeVal;
    

////////////////////////////////////////////////////////////
// FUNCTIONS 

    const countDownTime = () => {
        timer = setInterval(function() {
            time --;
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
        time = timeVal;
        clearInterval(timer);
        countDownTime();
    }

    const updateInfo = () => {
        $score.text(score);
        $missCounter.text(missCounter);
        $remainingTargets.text(remainingTargets.val);
        $round.text(round);
        $roundTime.text(time);
    }

    //  randomizes  x and y coordinates of target
    const randomLocationX = () => {
        // for both x and y, the first target locatin is always at origin because .target.width is undefined/nan at the first one becasue it has not been appended
        // if all targets on screen are clicked and there are stilll more targets, next one will always be at origin
        // this is solved by creating a div in html with target class and setting display none;
        //  or by setting img size to a standart 40 px, can randomize.
        const width = Math.random() * ($gamezone.width() - $('.target').width());
        return width;
    }
    const randomLocationY = () => {
        const height = Math.random() * ($gamezone.height() - $('.target').height());
        return height;
    }

     const stopTargets = () => {
        $('.target').off();
    }

    // brings up game over modal
    const gameOver = () => {
        clearInterval(timer);
        clearTimeout(targetTimeout);
        clearInterval(generateTarget);
        stopTargets();
        $gameOverModal.css('display', 'block');
        
    }

    // brings up winning modal
    const youWin = () => {
        clearInterval(timer);
        clearTimeout(targetTimeout);
        clearInterval(generateTarget);
        stopTargets();
        $youWinModal.css('display', 'block');
        
    }

    // brings up round over modal
    const roundOver = () => {
        clearTimeout(targetTimeout);
        clearInterval(generateTarget);
        clearInterval(timer);
        stopTargets();
        $roundOverModal.css('display', 'block');
    }

    //==========================
    // removes target on click
    // once clicked, the target id is added to key array so that misscounter is not incremented
    //==========================
    const clickTarget = (event, name) => {
        const target = $(event.currentTarget);
        score += 100;
        remainingTargets.removeTarget();
        updateInfo();
        keyArray.push(target.attr('id'));        
        target.remove();
        
    }

////////////////////////////////////////////////////////////
// GAME LOGIC

//==========================
// generates random name and assigns it to a newly created div
// assigns random x and y coordinate
// pushes to 2 different arrays and gives each target clickability
//========================== 
const createTargetArray = () => {
    for (let i = 0; i < $numberInput.val(); i++){
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

//==========================
// starts appending the first target in the array to the game zone and then removes the first element of the array
// gives last target in the array the listener that if it gets clicked, brings up round over screen
// note: if last target is not clicked, roundover will not occur
//==========================
const startGame = () => {
    generateTarget = setInterval(function() {
        if (round > 3) {
            youWin();
        }
        $gamezone.append(targetArray[0]);
        deadTarget = targetArray.shift();
        destroyTarget(deadTarget);
        if(targetArray.length === 0){
            $(`#${testArray[testArray.length-1].attr('id')}`).on('click', roundOver);
            clearInterval(generateTarget);
        }
        
    }, (interval*1000));
}

//==========================
// checks to see if the secondary array contains the id before removing/incrementing miss counter
//==========================
const destroyTarget = (thing) => {
    targetTimeout = setTimeout(function() {
        if(keyArray.includes(thing.attr('id')) === false){
            missCounter++;
            if(missCounter > 2){
                gameOver();
            }
            remainingTargets.removeTarget();
            updateInfo();
            thing.remove()
        }
    }, (targetDuration * 1000))
}

////////////////////////////////////////////////////////////
// EVENT HANDLERS

$('#input-form').on('submit', (event) => {
    event.preventDefault();
    remainingTargets.val = $numberInput.val();
    numberInput = $numberInput.val();
    interval = $intervalInput.val();
    time = $roundTimeInput.val();
    timeVal = $roundTimeInput.val();
    targetDuration = $durationInput.val();
    targetDurationVal = $durationInput.val();
    updateInfo();

})


$submitAndStart.on('click', () => {
    $introModal.hide();
    createTargetArray();
    startGame();
    countDownTime();
});


$closeGameOver.on('click', () => {
    $gameOverModal.hide();
})

$startNewRound.on('click', () => {
    $roundOverModal.hide();
    resetGame();
    round ++;
    targetDuration /= 2;
    updateInfo();
})

const resetGame = () => {
    missCounter = 0;
    remainingTargets.val = numberInput;
    keyArray = [];
    testArray = [];
    targetArray = [];
    resetTimer();
    createTargetArray();
    startGame();
}

$rulesButton.on('click', () => {
    $rules.toggle();
})

$restartButton.on('click', () => {
    $gamezone.empty();
    $gameOverModal.hide();
    $youWinModal.hide();
    resetGame();
    round = 1;
    score = 0;
    targetDuration = targetDurationVal;
    updateInfo();
})


})