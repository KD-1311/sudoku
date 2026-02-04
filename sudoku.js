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
    // Show solution highlighting without changing numbers
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const td = table.rows[r].cells[c];
        td.classList.remove('correct', 'incorrect'); // reset highlights

        const input = td.querySelector('input');

        if (input) {
          const val = parseInt(input.value);

          // Leave the user number visible
          td.textContent = input.value || ''; 

          if (val === currentSolution[r][c]) {
            td.classList.add('correct'); // green
          } else {
            td.classList.add('incorrect'); // red
          }
        } else {
          // Pre-filled number, always green
          td.textContent = currentSolution[r][c];
          td.classList.add('correct');
        }
      }
    }

    solutionVisible = true;
    document.querySelector('button[onclick="toggleSolution()"]').textContent = 'Hide Solution';
  } else {
    // Restore original puzzle with inputs
    renderBoard(currentPuzzle);
    solutionVisible = false;
    document.querySelector('button[onclick="toggleSolution()"]').textContent = 'Show Solution';
  }
}



// Generate first puzzle on load
generateSudoku();
