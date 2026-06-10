import { ref, computed } from 'vue';

export function useGameBuscaminas() {
  const rows = ref(9);
  const cols = ref(9);
  const totalMines = ref(10);
  
  const grid = ref([]);
  const gameState = ref('ready'); // ready, playing, won, lost
  const minesLeft = ref(10);
  const timer = ref(0);
  let timerInterval = null;
  
  const isMouseDown = ref(false);

  const initGame = () => {
    stopTimer();
    timer.value = 0;
    minesLeft.value = totalMines.value;
    gameState.value = 'ready';
    isMouseDown.value = false;
    
    let newGrid = [];
    for (let r = 0; r < rows.value; r++) {
      let row = [];
      for (let c = 0; c < cols.value; c++) {
        row.push({ r, c, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0 });
      }
      newGrid.push(row);
    }
    grid.value = newGrid;
  };

  const placeMines = (firstClickR, firstClickC) => {
    let placed = 0;
    let attempts = 0;
    while (placed < totalMines.value && attempts < 1000) {
      const r = Math.floor(Math.random() * rows.value);
      const c = Math.floor(Math.random() * cols.value);
      
      const isSafeZone = Math.abs(r - firstClickR) <= 1 && Math.abs(c - firstClickC) <= 1;
      
      if (!grid.value[r][c].isMine && !isSafeZone) {
        grid.value[r][c].isMine = true;
        placed++;
      }
      attempts++;
    }
    
    for (let r = 0; r < rows.value; r++) {
      for (let c = 0; c < cols.value; c++) {
        if (!grid.value[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) {
                if (grid.value[nr][nc].isMine) count++;
              }
            }
          }
          grid.value[r][c].neighborMines = count;
        }
      }
    }
  };

  const revealCell = (r, c) => {
    if (gameState.value === 'won' || gameState.value === 'lost') return;
    const cell = grid.value[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    if (gameState.value === 'ready') {
      gameState.value = 'playing';
      placeMines(r, c);
      startTimer();
    }

    cell.isRevealed = true;

    if (cell.isMine) {
      gameState.value = 'lost';
      stopTimer();
      for (let ir = 0; ir < rows.value; ir++) {
        for (let ic = 0; ic < cols.value; ic++) {
          if (grid.value[ir][ic].isMine && !grid.value[ir][ic].isFlagged) {
            grid.value[ir][ic].isRevealed = true;
          } else if (!grid.value[ir][ic].isMine && grid.value[ir][ic].isFlagged) {
            grid.value[ir][ic].isRevealed = true;
          }
        }
      }
      return;
    }

    if (cell.neighborMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows.value && nc >= 0 && nc < cols.value) {
            revealCell(nr, nc);
          }
        }
      }
    }

    let unrevealedSafe = 0;
    for (let ir = 0; ir < rows.value; ir++) {
      for (let ic = 0; ic < cols.value; ic++) {
        if (!grid.value[ir][ic].isMine && !grid.value[ir][ic].isRevealed) unrevealedSafe++;
      }
    }
    
    if (unrevealedSafe === 0) {
      gameState.value = 'won';
      minesLeft.value = 0;
      for (let ir = 0; ir < rows.value; ir++) {
        for (let ic = 0; ic < cols.value; ic++) {
          if (grid.value[ir][ic].isMine) grid.value[ir][ic].isFlagged = true;
        }
      }
      stopTimer();
    }
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameState.value === 'won' || gameState.value === 'lost') return;
    if (gameState.value === 'ready') {
        gameState.value = 'playing';
        startTimer();
    }
    
    const cell = grid.value[r][c];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    minesLeft.value += cell.isFlagged ? -1 : 1;
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timer.value < 999) timer.value++;
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
  };

  const setDifficulty = (level) => {
    if (level === 'beginner') { rows.value = 9; cols.value = 9; totalMines.value = 10; }
    else if (level === 'intermediate') { rows.value = 16; cols.value = 16; totalMines.value = 40; }
    else if (level === 'expert') { rows.value = 16; cols.value = 30; totalMines.value = 99; }
    initGame();
  };

  const formatNumber = (num) => {
    if (num < 0) return `-${Math.abs(num).toString().padStart(2, '0')}`;
    return num.toString().padStart(3, '0');
  };

  const faceIcon = computed(() => {
    if (gameState.value === 'lost') return '😵';
    if (gameState.value === 'won') return '😎';
    if (isMouseDown.value) return '😮';
    return '🙂';
  });

  const numberColor = (num) => {
    const colors = [
      '',
      'text-blue-600',
      'text-green-600',
      'text-red-600',
      'text-indigo-800',
      'text-red-800',
      'text-cyan-600',
      'text-black',
      'text-gray-600'
    ];
    return colors[num];
  };

  initGame();

  return {
    rows, cols, grid, gameState, minesLeft, timer, isMouseDown,
    initGame, revealCell, toggleFlag, setDifficulty, formatNumber, faceIcon, numberColor
  };
}