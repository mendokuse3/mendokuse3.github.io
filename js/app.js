$(() => {


// on opening, have modal that displays intro
    const $introModal = $('#intro-modal');
    const $closeIntro = $('#close-intro');

    $closeIntro.on('click', () => {
        $introModal.hide();
        createTargets();
    });


// timer on top
    // simply counts down from variable time, which by default
    // will be a set amount of time, but can be adjusted at bottom
    let time = 30;
    const $roundTime = $('#time').text(time);
    let timer;

    // round timer function
    const countDownTime = () => {
        timer = setInterval(function() {
            time --;
            console.log(time);
            
            $roundTime.text(time)
            if(time <= 0){
                $roundTime.css('font-size', '23px');
                $roundTime.text('TIME IS UP');
                // remove event listeners within play zone once time is up  
                clearInterval(timer);
            }
        }, 1000);
    }
    
    // starts timer once intro is closed
    $closeIntro.on('click', countDownTime);

    const resetTimer = () => {
        time = 30;
        countDownTime();
    }


// info area
    const $score = $('#score');
    const $missCounter = $('#miss-counter');
    const $remainingTargets = $('#remaining-targets');
    const $round = $('#round');

    let score = 0;
    let missCounter = 0;
    let remainingTargets = 5;
    let round = 1;
    // score which will update continuously upon clicks
    // miss clicked which will track expired targets and if you click on body
    // targets left will be default 20 targets, but can be set in bottom
    // round count will be default 5, but can be adjusted
    
    const updateInfo = () => {
        $score.text(score);
        $missCounter.text(missCounter);
        $remainingTargets.text(remainingTargets);
        $round.text(round);
    }

    
// game area
    // 2 different arrays to pick from, of good and bad
    // maybe 1 array, with penalty being array index >= 3;
    const pestArray = [
        "https://cdn.pixabay.com/photo/2013/07/13/10/26/snail-157212_1280.png", "https://cdn.pixabay.com/photo/2012/04/02/14/24/hungry-worm-24634_1280.png", "https://cdn.pixabay.com/photo/2013/07/13/10/15/cockroach-156887_1280.png"  
    ]

    // const dontClickArray = [
    //     "https://cdn.pixabay.com/photo/2014/04/03/09/58/eggplant-309459_1280.png", "https://cdn.pixabay.com/photo/2012/04/18/20/21/strawberry-37781_1280.png", "https://cdn.pixabay.com/photo/2013/07/12/18/19/tomato-153272_1280.png"
    // ]


    // const targetArray = [
    //     "https://cdn.pixabay.com/photo/2013/07/13/10/26/snail-157212_1280.png", "https://cdn.pixabay.com/photo/2012/04/02/14/24/hungry-worm-24634_1280.png", "https://cdn.pixabay.com/photo/2013/07/13/10/15/cockroach-156887_1280.png", "https://cdn.pixabay.com/photo/2014/04/03/09/58/eggplant-309459_1280.png", "https://cdn.pixabay.com/photo/2012/04/18/20/21/strawberry-37781_1280.png", "https://cdn.pixabay.com/photo/2013/07/12/18/19/tomato-153272_1280.png"
    // ]

    const $gamezone = $('#play-area');


//  randomizes  x and y coordinates of target
    const randomLocationX = () => {
        // for both x and y, the first target locatin is always at origin because .target.width is undefined/nan at the first one becasue it has not been appended
        const width = Math.random() * ($gamezone.width() - $('.target').width());
        return width;
    }
    const randomLocationY = () => {
        const height = Math.random() * ($gamezone.height() - $('.target').height());
        return height;
    }

// Logic for generating targets
    const createTargets = () => {
        let i = remainingTargets;
        const targetInterval = setInterval(function() {
            let x = Math.floor(Math.random() * (pestArray.length));
            let randomName = Math.floor(Math.random() * 20000);
            const target = $('<div>').addClass(`target key-${randomName}`);
            target.css('background-image', `url(${pestArray[x]}`);
            target.css({
                'top': `${randomLocationY()}px`,
                'left': `${randomLocationX()}px`
            });

            target.on('click', clickTarget);

            const targetDur = () => {
                return new Promise(function (resolve, reject) {
                    setTimeout(resolve, (targetDuration * 1000));
                }).then((data) => {
                    if ($(`.key-${randomName}`).length > 0) {
                        target.remove();
                        missCounter++;
                        remainingTargets--;
                        updateInfo();
                    }
                });
            }
            targetDur()

            
            $gamezone.append(target);
            
            i --;
            
            if(i <= 0 || $roundTime.text() === "TIME IS UP") {
                clearInterval(targetInterval);
                clearInterval(timer);
                stopTargets();
                    // if($roundTime.text() === "TIME IS UP"){
                // }
                // gameOver();
            }
        }, (interval*1000));
    }

   
    // makes targets unclickable after time is up or miss too many
    const stopTargets = () => {
        $('.target').off();
    }

    const gameOver = () => {
        clearInterval(timer);
        $gameOverModal.css('display', 'block');
        // repeats for 4 seconds
        console.log('hi');
        
    }
    
    // game over modal
    const $gameOverModal = $('#game-over-modal');
    const $closeGameOver = $('#close-game-over');
    $closeGameOver.on('click', () => {
        $gameOverModal.hide();
    })


    // removes target on click
    const clickTarget = event => {
        const target = event.currentTarget;
        // clicking on image will remove the div and add a point to score while decrementing target left
        // increment score and decrement targets left
        score += 100;
        remainingTargets --;
        updateInfo();
        target.remove();
        if(remainingTargets === 0){
            clearInterval(timer);
        }
    }

    
    
    // math.random to randomly generate position x and position y
    // divs that pop up are absolute and contain random images which will be in an array
    // target will last a set time before removing itself
    // clicking on body will decrement score
    // after all the targets have been displayed and clicked, round is over
    // once round is over, either display button or time before next round
    
    
    
    // option area
    const interval = 1;  //could change to ms
    // rules will be a button that opens modal that explains the rules of game
    // num of popups will take input that adjusts target left in info aka max targets/round
    // popup size will take input that adjusts size of divs -> images
    // round timer will adjsut time counter at top, which stays same at each round
    // target duration affects how long target lasts
    const targetDuration = 3;
    
    
    
    
    $('#rules').on('click', resetTimer)
    // createTargets();

})