let boxes = Array.from(document.querySelectorAll('.inner'));
let h2 = document.querySelector('h2');
let restartBtn = document.querySelector('#restart');
let choose = document.querySelector('.choose');

let turnX = true;
let count = 0;
let level = null; 

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6]
];
function disableBtn() {
    boxes.forEach((box) => {
        box.disabled = true;
    })
}

function enableBtn() {
    boxes.forEach((box) => {
        box.disabled = false;
    })
}

function checkWin(){
    // console.log("Checking Win");
    for(let pattern of winPatterns){
        let p1 = boxes[pattern[0]].innerText;
        let p2 = boxes[pattern[1]].innerText;
        let p3 = boxes[pattern[2]].innerText;

        if(p1 !=="" && p2!=="" && p3 !== ""){
            if(p1 === p2 && p2 === p3){
                disableBtn();
                return true;
            }
        }
    }
    return false;
}

async function chooseOppponent() {
    choose.innerHTML = `
    <p>Choose Your Opponent</p>
    <div class="btns-cont">
    <button class="btns opponent" id="Human">Human</button>
    <button class="btns opponent" id="Computer">Computer</button>
    </div>
    `;
     
    return new Promise(resolve=>{
        let opponent = Array.from(document.querySelectorAll('.opponent'));
        opponent.forEach(op => {
            op.addEventListener('click',function(){
                console.log(this.getAttribute('id'));
                resolve(this.getAttribute("id"));
            })
        });
    })
}

async function chooseLevel() {
        
        let levelText = `<p>Choose A Level</p>
        <div class="btns-cont">
        <button class="btns level" id="Easy">Easy</button>
        <button class="btns level" id="Medium">Medium</button>
       
        </div>`;
        choose.innerHTML = levelText;
        return new Promise(resolve => {
            let levels = document.querySelectorAll('.level');
            levels.forEach(level => {
                level.addEventListener('click', function () {
                    // console.log('chooseLevel',this.getAttribute('id'));
                    console.log('Choosing Level',this.getAttribute('id'));
                    resolve(this.getAttribute('id'));
                });
            });
        });
}

function easyMove(){
    console.log('Easy move Finding...');
    
    let emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");
    if(emptyBoxes.length > 0){
        let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        return randomBox;
    }
}

function mediumMove() {
    console.log("Medium Move finding...");

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let p1 = boxes[a].innerText, p2 = boxes[b].innerText, p3 = boxes[c].innerText;

        if (p1 === 'X' && p2 === 'X' && p3 === "") {
            return boxes[c];
        } else if (p2 === 'X' && p3 === 'X' && p1 === "") {
            return boxes[a];
        } else if (p1 === 'X' && p3 === 'X' && p2 === "") {
            return boxes[b]; 
        }
    }

  
    let emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");

    if (emptyBoxes.length > 0) {
        let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        return randomBox;
    }
}

async function playComputer() {
    level = await chooseLevel();
    // console.log('Playing Computer',level);
    choose.innerHTML = `<p>Opponent : Computer | Level : ${level} </p>`;


    enableBtn();
    boxes.forEach((box) => {
        box.addEventListener('click',function(){    
            
            if(box.innerText === ""){
                if (turnX) {
                    box.innerText = "X";
                    turnX = false;  // Switch turn to computer
                    count++;

                    // Check if human won
                    let isWinner = checkWin();
                    if (isWinner) {
                        h2.innerText = 'You Win!';
                        disableBtn();
                    } else if (count === 9) {
                        h2.innerText = 'Game Draw';
                    }
                    else {
                        // If no win, let computer play
                        h2.innerText = "Computer's Turn...";
                        disableBtn();  // Disable boxes during computer's turn

                        setTimeout(() => {
                            if (level === "Medium") {
                                let move = mediumMove(); // Get the medium level move
                                if (move) {
                                    move.innerText = 'O';
                                    move.disabled = true;
                                }
                            } 
                            else {
                                let move = easyMove(); 
                                if (move) {
                                    move.innerText = 'O';
                                    move.disabled = true;
                                }
                            }
                            turnX = true;  // Switch back to human
                            count++;

                            // Check if computer won
                            let isWinner = checkWin();
                            if (isWinner) {
                                h2.innerText = 'You Lose!';
                                disableBtn();
                            } else if (count === 9) {
                                h2.innerText = 'Game Draw';
                            } else {
                                h2.innerText = "Your Turn";
                                enableBtn();  // Re-enable buttons for human's turn
                            }
                        }, 1000);  // Delay for computer's move
                    }
                }
            }
        });
    });
}

function playHuman(){
    // console.log('play Human');
    enableBtn();
    boxes.forEach((box) => {
        box.addEventListener('click',function(){    
            // console.log('PlayingHuman');
            if(box.innerText === ""){
                if(turnX){
                    box.innerText = "X";
                    turnX = false;
                    h2.innerText = "Player 2's Turn";
                }
                else{
                    box.innerText = "O";
                    turnX = true;
                    h2.innerText = "Player 1's Turn";
                }
                count++;
                if(checkWin()){
                    turnX ? h2.innerText = "Player 2 Wins" : h2.innerText = "Player 1 Wins";
                    // opponent.disabled = true; // In restart enable them
                }
                if(count>8 && !checkWin()){
                    h2.innerText = "Draw";
                    // opponent.disabled =true;
                }
            }
        })
    })
}

function reset() {
    boxes.forEach((box) => {
        let newBox = box.cloneNode(true);  // create a  clone  of box to remove all listeners
        box.parentNode.replaceChild(newBox, box);  // replace the old box with the new box having no listners
    });
    boxes = Array.from(document.querySelectorAll('.inner'));  
}

async function startGame(){
   let op = await chooseOppponent();
   disableBtn();
//    console.log('startGame',op);
   
   if(op === 'Human'){
    
    choose.innerHTML = "Player 1 - X || Player 2 - O ";
    h2.innerText = "Let's Start"    
    playHuman();
   }
   else if(op === 'Computer'){
        // level = await chooseLevel();
        // console.log('startGame',op,level);
        playComputer();
   }
}

restartBtn = document.querySelector('#restart');
// make a new function for opponent
restartBtn.addEventListener('click', function(){
    count = 0;
    turnX = true;
    boxes.forEach((box)=>{
        box.innerText  = "";
    })
    h2.innerText = "Play Game";
    reset();
    startGame();
})

startGame();
