// 9x9 Backtracking solver
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {

        let numbers = shuffle([1,2,3,4,5,6,7,8,9]); // RANDOM ORDER

        for (let num of numbers) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }

        return false;
      }
    }
  }
  return true;
}


// Check if number can be placed
function isSafe(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

// Generate full 9x9 board
function generateFullSudoku() {
  let board = Array.from({length:9},()=>Array(9).fill(0));
  solve(board);
  return board;
}

// Remove numbers to make puzzle
function makePuzzle(board) {
  const puzzle = board.map(r=>r.slice());
  const remove = 45 + Math.floor(Math.random()*10); // remove 45-54 cells
  for(let i=0;i<remove;i++){
    let r,c;
    do {
      r=Math.floor(Math.random()*9);
      c=Math.floor(Math.random()*9);
    } while(puzzle[r][c]===0);
    puzzle[r][c]=0;
  }
  return puzzle;
}

function renderBoard(puzzle) {
  const table = document.getElementById('sudoku');
  table.innerHTML = '';

  for (let r = 0; r < 9; r++) {
    const tr = document.createElement('tr');

    for (let c = 0; c < 9; c++) {
      const td = document.createElement('td');

      if (puzzle[r][c] !== 0) {
        td.textContent = puzzle[r][c];
        td.classList.add('fixed'); // uneditable, always green
      } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.fontSize = '24px';
        input.style.textAlign = 'center';

        // Check the cell as user types
        input.addEventListener('input', () => checkCell(r, c, input));

        td.appendChild(input);
      }

      tr.appendChild(td);
    }

    table.appendChild(tr);
  }
}
function checkCell(row, col, input) {
  const table = document.getElementById('sudoku');
  const td = table.rows[row].cells[col];

  td.classList.remove('correct', 'incorrect');

  const val = parseInt(input.value);
  if (!val) return; // ignore empty input

  if (val === currentSolution[row][col]) {
    td.classList.add('correct');   // green highlight
  } else {
    td.classList.add('incorrect'); // red highlight
  }
  if (checkIfSolved()) {
  stopTimer();
  alert("Solved! Time: " + formatTime(seconds));
}

}


// Global variables
let currentPuzzle = [];
let currentSolution = [];
let solutionVisible = false;

// Generate puzzle
function generateSudoku() {
  const full = generateFullSudoku();
  const puzzle = makePuzzle(full);
  currentPuzzle = puzzle;
  currentSolution = full;
  renderBoard(currentPuzzle);
  startTimer();

}
function checkIfSolved() {
  const cells = document.querySelectorAll("#sudoku td");

  for (let td of cells) {
    if (td.querySelector("input")) {
      if (!td.classList.contains("correct")) {
        return false;
      }
    }
  }
  return true;
}


function checkSolution() {
  const table = document.getElementById('sudoku');

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const td = table.rows[r].cells[c];
      td.classList.remove('correct', 'incorrect');

      const input = td.querySelector('input');

      if (input) {
        const val = parseInt(input.value);
        if (val === currentSolution[r][c]) {
          td.classList.add('correct');   // green highlight
        } else {
          td.classList.add('incorrect'); // red highlight
        }
      } else {
        td.classList.add('correct');     // pre-filled number always green
      }
      
    }
  }
}


function toggleSolution() {
  const table = document.getElementById('sudoku');

  if (!solutionVisible) {
    // Highlight solution without deleting inputs
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const td = table.rows[r].cells[c];
        const input = td.querySelector('input');

        if (input) {
          const val = parseInt(input.value);
          if (val === currentSolution[r][c]) {
            td.classList.add('correct');
            td.classList.remove('incorrect');
          } else {
            td.classList.add('incorrect');
            td.classList.remove('correct');
          }
        } else {
          td.classList.add('correct'); // fixed numbers
        }
      }
    }

    solutionVisible = true;
  } else {
    // Remove highlights only
    const cells = document.querySelectorAll("#sudoku td");
    cells.forEach(td => td.classList.remove("correct", "incorrect"));
    solutionVisible = false;
  }
}

let timerInterval;
let seconds = 0;

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").innerText = 
      "Time: " + formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}




// Generate first puzzle on load
generateSudoku();
