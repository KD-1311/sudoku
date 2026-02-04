// 9x9 Backtracking solver
function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
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

// Render board with inputs
function renderBoard(board) {
  const table = document.getElementById('sudoku');
  table.innerHTML='';
  for(let r=0;r<9;r++){
    const tr = document.createElement('tr');
    for(let c=0;c<9;c++){
      const td = document.createElement('td');
      if(board[r][c]!==0){
        td.textContent = board[r][c];
        td.classList.add('fixed');
      } else {
        const input = document.createElement('input');
        input.type='number';
        input.min=1;
        input.max=9;
        td.appendChild(input);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
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
}

// Check solution
function checkSolution() {
  const table = document.getElementById('sudoku');
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const td = table.rows[r].cells[c];
      td.classList.remove('correct','incorrect'); // clear previous highlights
      const input = td.querySelector('input');
      if(input){
        const val = parseInt(input.value);
        if(val && val === currentSolution[r][c]){
          td.classList.add('correct');
        } else {
          td.classList.add('incorrect');
        }
      } else {
        td.classList.add('correct'); // pre-filled numbers are "correct"
      }
    }
  }
}
function toggleSolution() {
  const table = document.getElementById('sudoku');

  if (!solutionVisible) {
    // Show solution
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const td = table.rows[r].cells[c];
        td.classList.remove('correct','incorrect');
        td.innerHTML = currentSolution[r][c]; // fill solution
        td.classList.add('correct');          // highlight green
      }
    }
    solutionVisible = true;
    document.querySelector('button[onclick="toggleSolution()"]').textContent = 'Hide Solution';
  } else {
    // Hide solution and restore puzzle
    renderBoard(currentPuzzle); // restores user inputs
    solutionVisible = false;
    document.querySelector('button[onclick="toggleSolution()"]').textContent = 'Show Solution';
  }
}


// Generate first puzzle on load
generateSudoku();
