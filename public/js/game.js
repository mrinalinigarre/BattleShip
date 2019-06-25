
class Game {

  constructor(){
    this.username;
    this.gameId;
    this.socket;
    this.shipColor = '#4b535b';
    this.oceanColor = '#00a9ff';
    this.shotColor = '#d80000';
    this.oceanMissColor = '#0200aa';
    this.turn;
  }

  setUsername(username){
    this.username = username;
  }

  getUsername(){
    return this.username;
  }

  setGameId(gameId){
    this.gameId = gameId;
  }

  getGameId(){
    return this.gameId;
  }

  setSocket(socket){
    this.socket = socket;
  }

  getSocket(){
    return this.socket;
  }

  setTurn(turn){
    this.turn = turn;
  }

  getTurn(){
    return this.turn;
  }

  // PHASE 1 OF GAME
  initializeGame() {
    let socket = this.socket;
    this.createGameBoard(10);
    let ships = [];
    let positionsAll = [];

    /* SHIP BUTTONS */
    // Destroyer
    let destroyerHorizontal = document.getElementById('destroyer-horizontal');
    destroyerHorizontal.addEventListener('click', () => {
      destroyerHorizontal.setAttribute('data-orientation', 'horizontal');
      destroyerHorizontal.setAttribute('data-ship', 'destroyer');
      destroyerHorizontal.setAttribute('data-selected', '');
    });

    let destroyerVertical = document.getElementById('destroyer-vertical');
    destroyerVertical.addEventListener('click', () => {
      destroyerHorizontal.setAttribute('data-orientation', 'vertical');
      destroyerHorizontal.setAttribute('data-ship', 'destroyer');
      destroyerHorizontal.setAttribute('data-selected', '');
    });

    //Submarine
    let submarineHorizontal = document.getElementById('submarine-horizontal');
    submarineHorizontal.addEventListener('click', () => {
      submarineHorizontal.setAttribute('data-orientation', 'horizontal');
      submarineHorizontal.setAttribute('data-ship', 'submarine');
      submarineHorizontal.setAttribute('data-selected', '');
    })

    let submarineVertical = document.getElementById('submarine-vertical');
    submarineVertical.addEventListener('click', () => {
      submarineVertical.setAttribute('data-orientation', 'vertical');
      submarineVertical.setAttribute('data-ship', 'submarine');
      submarineVertical.setAttribute('data-selected', '');
    })

    //Cruiser
    let cruiserHorizontal = document.getElementById('cruiser-horizontal');
    cruiserHorizontal.addEventListener('click', () => {
      cruiserHorizontal.setAttribute('data-orientation', 'horizontal');
      cruiserHorizontal.setAttribute('data-ship', 'cruiser');
      cruiserHorizontal.setAttribute('data-selected', '');
    })

    let cruiserVertical = document.getElementById('cruiser-vertical');
    cruiserVertical.addEventListener('click', () => {
      cruiserVertical.setAttribute('data-orientation', 'vertical');
      cruiserVertical.setAttribute('data-ship', 'cruiser');
      cruiserVertical.setAttribute('data-selected', '');
    })

    //Battleship
    let battleshipHorizontal = document.getElementById('battleship-horizontal');
    battleshipHorizontal.addEventListener('click', () => {
      battleshipHorizontal.setAttribute('data-orientation', 'horizontal');
      battleshipHorizontal.setAttribute('data-ship', 'battleship');
      battleshipHorizontal.setAttribute('data-selected', '');
    })

    let battleshipVertical = document.getElementById('battleship-vertical');
    battleshipVertical.addEventListener('click', () => {
      battleshipVertical.setAttribute('data-orientation', 'vertical');
      battleshipVertical.setAttribute('data-ship', 'battleship');
      battleshipVertical.setAttribute('data-selected', '');
    })

    //Carrier
    let carrierHorizontal = document.getElementById('carrier-horizontal');
    carrierHorizontal.addEventListener('click', () => {
      carrierHorizontal.setAttribute('data-orientation', 'horizontal');
      carrierHorizontal.setAttribute('data-ship', 'carrier');
      carrierHorizontal.setAttribute('data-selected', '');
    })

    let carrierVertical = document.getElementById('carrier-vertical');
    carrierVertical.addEventListener('click', () => {
      carrierVertical.setAttribute('data-orientation', 'vertical');
      carrierVertical.setAttribute('data-ship', 'carrier');
      carrierVertical.setAttribute('data-selected', '');
    })

    /* SHIP BUTTONS END */

    /* SELECTING POSITIONS */

    let cells = document.getElementsByClassName("cell");

    [].forEach.call(cells, (cell) => {
      cell.addEventListener('click', (e) => {
        if (!(document.querySelector('[data-selected]') === null)) {
          let selected = document.querySelector('[data-selected]');
          let shipOrientation = selected.getAttribute('data-orientation');
          let shipType = selected.getAttribute('data-ship');
          let currentPosition = parseInt(cell.getAttribute('data-position'));
          let shipLength = 0;
          let shipObj = {};
          let positions = [];

          shipObj.shipType = shipType;


          switch (shipType) {
            case 'destroyer':
              shipLength = 2;
              break;

            case 'submarine':
              shipLength = 3;
              break;

            case 'cruiser':
              shipLength = 3;
              break;

            case 'battleship':
              shipLength = 4;
              break;

            case 'carrier':
              shipLength = 5;
              break;
            default:
          }

          switch (shipOrientation) {
            case 'horizontal':

              for (let i = 0; i < shipLength; i++) {
                cells[currentPosition].style.backgroundColor = this.shipColor;
                positions.push(currentPosition);
                positionsAll.push(currentPosition);
                currentPosition++;
              }
              selected.removeAttribute('data-selected');
              $(function(){
                let ship = '#' + shipType;
                $(ship + '-container').slideUp(250);
              });

              break;

            case 'vertical':
              for (let i = 0; i < shipLength; i++) {
                cells[currentPosition].style.backgroundColor = this.shipColor;
                positions.push(currentPosition);
                positionsAll.push(currentPosition);
                currentPosition += 10;
              }
              selected.removeAttribute('data-selected');
              $(function(){
                let ship = '#' + shipType;
                $(ship + '-container').slideUp(250);
              });

              break;
          }

          shipObj.positions = positions;
          ships.push(shipObj);
        }

      });

      /* SELECTING POSITIONS END */

      /* GAMEBOARD HOVER OVER EFFECT */

      cell.addEventListener('mouseover', () => {
        if (!(document.querySelector('[data-selected]') === null)) {
          let selected = document.querySelector('[data-selected]');
          let shipOrientation = selected.getAttribute('data-orientation');
          let shipType = selected.getAttribute('data-ship');
          let currentPosition = parseInt(cell.getAttribute('data-position'));
          let shipLength = 0;

          switch (shipType) {
            case 'destroyer':
              shipLength = 2;
              break;

            case 'submarine':
              shipLength = 3;
              break;

            case 'cruiser':
              shipLength = 3;
              break;

            case 'battleship':
              shipLength = 4;
              break;

            case 'carrier':
              shipLength = 5;
              break;
            default:
          }

          switch (shipOrientation) {
            case 'horizontal':

              for (let i = 0; i < shipLength; i++) {
                if (cells[currentPosition] != undefined) {
                  cells[currentPosition].style.backgroundColor = this.shipColor;
                }
                currentPosition++;
              }

              break;

            case 'vertical':
              for (let i = 0; i < shipLength; i++) {
                if (cells[currentPosition] != undefined) {
                  cells[currentPosition].style.backgroundColor = this.shipColor;
                }
                currentPosition += 10;
              }

              break;
          }
        }

        cell.addEventListener('mouseout', () => {
          if (!(document.querySelector('[data-selected]') === null)) {
            let selected = document.querySelector('[data-selected]');
            let shipOrientation = selected.getAttribute('data-orientation');
            let shipType = selected.getAttribute('data-ship');
            let currentPosition = parseInt(cell.getAttribute('data-position'));
            let shipLength = 0;

            switch (shipType) {
              case 'destroyer':
                shipLength = 2;
                break;

              case 'submarine':
                shipLength = 3;
                break;

              case 'cruiser':
                shipLength = 3;
                break;

              case 'battleship':
                shipLength = 4;
                break;

              case 'carrier':
                shipLength = 5;
                break;
              default:
            }

            switch (shipOrientation) {
              case 'horizontal':

                for (let i = 0; i < shipLength; i++) {
                  if (!positionsAll.includes(currentPosition)) {
                    if (cells[currentPosition] != undefined) {
                      cells[currentPosition].style.backgroundColor = this.oceanColor;
                    }
                  }
                  currentPosition++;
                }

                break;

              case 'vertical':
                for (let i = 0; i < shipLength; i++) {
                  if (!positionsAll.includes(currentPosition)) {
                    if (cells[currentPosition] != undefined) {
                      cells[currentPosition].style.backgroundColor = this.oceanColor;
                    }
                  }
                  currentPosition += 10;
                }

                break;
            }
          }

        });
      });
    });
    /* GAMEBOARD HOVER EFFECT END */

    /* RESET BUTTON */
    let resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
      positionsAll = [];
      ships = [];

      [].forEach.call(cells, (cell) => {
        cell.style.backgroundColor = this.oceanColor;
      })

      $(function(){
        $('#destroyer-container').slideDown();
        $('#cruiser-container').slideDown();
	$('#submarine-container').slideDown();
	$('#battleship-container').slideDown();
	$('#carrier-container').slideDown();
      })
    })
    /* RESET BUTTON END */

    /* READY BUTTON */
    
    let readyButton = document.getElementById('ready-button');

    readyButton.addEventListener('click', () => {
      let username = this.username;
      let gameId = this.gameId;

      fetch('/game/setPositions', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          ships: ships,
          username: username,
          gameId: gameId,
        }),

      }).then(()=>{
        $(function(){
          $('#ready-container').slideUp(250);
        })

        socket.emit('player-ready', {
          username: username,
        });

      })

    })

  }
  

  /* CREATES GAMEBOARD */
  createGameBoard(size) {
    let main = document.getElementById('gameboard');
    let count = 0;
    let gameboard = document.createElement('table');
    gameboard.setAttribute('class', 'gameboard');

    //creates the numbers 1 - 10 on top of board
    let firstRow = document.createElement('tr');
    let emptyCell = document.createElement('th');
    firstRow.appendChild(emptyCell);

    for(let i = 0; i < 10; i++){
      let numRow = document.createElement('th');
      numRow.setAttribute('class', 'text-center');
      numRow.innerHTML = i + 1;
      firstRow.appendChild(numRow); 
    }
    gameboard.appendChild(firstRow);

    // creates the letters A - J on left side  and individual cells
    for (let i = 0; i < size; i++) {
      let row = document.createElement('tr');
      let letterList = document.createElement('th');
      let alphaIndex = 65 + i;

      letterList.setAttribute('class', 'letter-cell');
      letterList.innerHTML = '&#' + alphaIndex++;
      row.appendChild(letterList);

      for (let k = 0; k < size; k++) {
        let cell = document.createElement('td');
        cell.setAttribute('data-position', count++);
        cell.setAttribute('class', 'cell');
        cell.style.backgroundColor = this.oceanColor;
        row.appendChild(cell);
      }

      gameboard.appendChild(row);
    }

    main.appendChild(gameboard);
  }

  //PHASE 2 OF GAME //
  startGame(positions){
    let shipColor = this.shipColor;
    let oceanColor = this.oceanColor;
    let shotColor = this.shotColor;
    let oceanMissColor = this.oceanMissColor;
    let socket = this.socket;
    let username = this.username;
    let turn = this.turn;

    let main = document.getElementById('main');

    while(main.firstChild){
      main.removeChild(main.firstChild);
    }

    /* LOAD GAME BOARDS */

    //  Player's Gameboard
    let playerGameBoard = createGameBoard('player');
    let playerBoard = document.createElement('div');
    playerBoard.setAttribute('class', 'col');
    playerBoard.setAttribute('id', 'player-board');
    playerBoard.appendChild(playerGameBoard);

    let yourBoardLabel = document.createElement('div');
    yourBoardLabel.className += 'text-center';
    yourBoardLabel.innerHTML = 'YOU';
    playerBoard.appendChild(yourBoardLabel);

    //  Opponent's GameBoard
    let opponentGameBoard = createGameBoard('opponent');
    let opponentBoard = document.createElement('div');
    opponentBoard.setAttribute('class', 'col');
    opponentBoard.setAttribute('id', 'opponent-board');
    opponentBoard.appendChild(opponentGameBoard);

    let opponentBoardLabel = document.createElement('div');
    opponentBoardLabel.className += 'text-center';
    opponentBoardLabel.innerHTML = 'OPPONENT';
    opponentBoard.appendChild(opponentBoardLabel);

    //  Waiting Board
  /*let waitingGameBoard = createGameBoard('waiting');
    let waitingBoard = document.createElement('div');
    waitingBoard.setAttribute('class', 'col');
    waitingBoard.setAttribute('id', 'waiting-board');
    waitingBoard.appendChild(waitingGameBoard);

    let waitingBoardLabel = document.createElement('div');
    waitingBoardLabel.className += 'text-center';
    waitingBoardLabel.innerHTML = 'OPPONENT';
    waitingBoard.appendChild(waitingBoardLabel);
  */
    //Create Div to under board
    let rowB = document.createElement('div');
    rowB.className = 'row';
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container col text-center';
    buttonContainer.id = 'button-container';
    rowB.appendChild(buttonContainer);

    //Create button to submit position
    let submitPosition = document.createElement('button');
    submitPosition.id = 'submit-position';
    submitPosition.innerHTML = 'End Turn';

    //Create opponent waiting box
    let waitingOpponent = document.createElement('button');
    waitingOpponent.id = 'waiting-opponent';
    waitingOpponent.innerHTML = "Opponent's turn...";

    //Attach both boards on to page
    let rowA = document.createElement('div');
    rowA.className = "row";
    rowA.appendChild(playerBoard);
    rowA.appendChild(opponentBoard);
    main.appendChild(rowA);

    loadShips(positions);
    mainGameLoop();


    function mainGameLoop(){
      let positionHistory = [];
      let selectOpponentPosition;
      let opponentCells = document.getElementsByClassName('opponent-cell');
      let playerCells = document.getElementsByClassName('player-cell');
      let opponentBoard = document.getElementById('opponent-board');
      let waitingBoard = document.getElementById('waiting-board');

      [].forEach.call(opponentCells, cell =>{
        let currentPosition = parseInt(cell.getAttribute('data-opponent-position'));

        cell.addEventListener('click', ()=>{
          if(selectOpponentPosition && !(positionHistory.includes(selectOpponentPosition)) ){
            opponentCells[selectOpponentPosition].style.backgroundColor = oceanColor;
          }

          if(positionHistory.includes(currentPosition)){
            socket.emit('message-send', {
              username: '<span style="color:red"><strong>GAME</strong></span>',
              message:'<span style="color:red;"><strong>Cannot choose the same position twice</strong></span>',
            })

            return;
          }

          selectOpponentPosition = currentPosition;

          cell.style.backgroundColor = 'red';
        });

        cell.addEventListener('mouseover', ()=>{

          if( !(positionHistory.includes(currentPosition)) ){
            cell.style.backgroundColor = 'red';
          }

          //Show opponent's mouseover
          socket.emit('opponent-mouseover',{
              playerName : username,
              position: currentPosition,
          })

        })

        cell.addEventListener('mouseout', ()=>{

          if( !(positionHistory.includes(currentPosition) || selectOpponentPosition === currentPosition) ){
            cell.style.backgroundColor = oceanColor;
          }

          //Show opponent's mouseleave
          socket.emit('opponent-mouseleave', {
            playerName : username,
            position: currentPosition,
          })

        })
      })

      /* Show opponent movement events 
      socket.on('opponent-mouseover', (data =>{
        if(data.playerName !== username){
          let yourBoard = document.getElementsByClassName('player-cell');

          yourBoard[data.position].style.backgroundColor = '#fce300';
        }
      }))

      socket.on('opponent-mouseleave', (data =>{
        if(data.playerName !== username){
          let yourBoard = document.getElementsByClassName('player-cell');

          let currentColor = 
          yourBoard[data.position].style.
        }
      })
       Show opponent movement events end */

      //Add event listener to submit to check position
      submitPosition.addEventListener('click', ()=>{
        positionHistory.push(selectOpponentPosition);

        socket.emit('check-position', {
          playerName: username,
          position: selectOpponentPosition,
        })

      })

      //If it is the player's turn, they will have the "end turn" button
      //Else "Waiting for opponent" will display
      if(turn === username){
        buttonContainer.appendChild(submitPosition);
        main.appendChild(buttonContainer);

       // opponentBoard.style.display = "block";
       // waitingBoard.style.display = "none";
      } else {
        buttonContainer.appendChild(waitingOpponent);
        main.appendChild(buttonContainer);

        //opponentBoard.style.display = "none";
        //waitingBoard.style.display = "block";
      }

      socket.on('end-turn', (data)=>{
        turn = data.turn;

        if(turn === username){
          buttonContainer.removeChild(buttonContainer.firstChild);
          buttonContainer.appendChild(submitPosition);
          main.appendChild(buttonContainer);

          //opponentBoard.style.display = "block";
          //waitingBoard.style.display = "none";
        } else {
          buttonContainer.removeChild(buttonContainer.firstChild);
          buttonContainer.appendChild(waitingOpponent);
          main.appendChild(buttonContainer);

          //opponentBoard.style.display = "none";
          //waitingBoard.style.display = "block";
        }
      })

      socket.on('hit', (data)=>{
        let playerName = data.playerName;
        let position = data.position;
        let message = data.message;

        let notificationContainer = document.getElementById('game-notifications');

        let hitNotification = createHitNotification(message);
        notificationContainer.appendChild(hitNotification);
        $(function(){
          let $this = $(hitNotification);

          $this.slideDown(350, ()=>{
            setTimeout( ()=>{
              $this.slideUp(350);
            }, 4000);
          });
        })


        if(data.playerName == username){
          opponentCells[position].style.backgroundColor = shotColor;
        } else {
          playerCells[position].style.backgroundColor = shotColor;
        }

      })

      socket.on('miss', (data)=>{
        let playerName = data.playerName;
        let position = data.position;
        let message = data.message;

        let notificationContainer = document.getElementById('game-notifications');

        let missNotification = createMissNotification(message);
        notificationContainer.appendChild(missNotification);
        $(function(){
          let $this = $(missNotification);

          $this.slideDown(350, ()=>{
            setTimeout( ()=>{
              $this.slideUp(350);
            }, 4000);
          });
        })

        if(playerName == username){
          opponentCells[position].style.backgroundColor = oceanMissColor;
        } else {
          playerCells[position].style.backgroundColor = oceanMissColor;
        }

      })

      socket.on('game-over', (data)=>{
        let message = data.winner.toUpperCase() + " has won the match!";
        $(function(){
          $('#game-over-message').html(message);
          $('#game-over').show();
        });

      })


    }


    function loadShips(positions){
      let playerCells = document.getElementsByClassName('player-cell');

      [].forEach.call(playerCells, (cell)=>{
        let cellPosition = parseInt(cell.getAttribute('data-player-position'));

        positions.forEach( position => {

          if(cellPosition == position){
            cell.style.backgroundColor = shipColor;
            cell.setAttribute('data-ship', 'true');
          }

        })
      })
    }

    function createGameBoard(name) {
      let count = 0;
      let gameboard = document.createElement('table');
      gameboard.setAttribute('class', 'gameboard');

      //creates the numbers 1 - 10 on top of board
      let firstRow = document.createElement('tr');
      let emptyCell = document.createElement('th');
      firstRow.appendChild(emptyCell);

      for(let i = 0; i < 10; i++){
        let numRow = document.createElement('th');
        numRow.setAttribute('class', 'text-center');
        numRow.innerHTML = i + 1;
        firstRow.appendChild(numRow);
      }
      gameboard.appendChild(firstRow);

      // creates the letters A - J on left side  and individual cells
      for (let i = 0; i < 10; i++) {
        let row = document.createElement('tr');
        let letterList = document.createElement('th');
        let alphaIndex = 65 + i;

        letterList.setAttribute('class', 'letter-cell');
        letterList.innerHTML = '&#' + alphaIndex++;
        row.appendChild(letterList);

        for (let k = 0; k < 10; k++) {
          let cellName = 'data-' + name + '-position';
          let cell = document.createElement('td');
          cell.setAttribute(cellName, count++);
          cell.setAttribute('class', name + '-cell');

          if(name == 'player'){
            cell.style.backgroundColor = oceanColor; 
          } else {
            cell.style.backgroundColor = oceanColor;
          }

          row.appendChild(cell);
        }

        gameboard.appendChild(row);
      }

      return gameboard;
    }

    function createMissNotification(message){
      let missNotification = document.createElement('div');
      missNotification.setAttribute('id', 'game-notification-item');
      missNotification.style.display = 'none';
      missNotification.innerHTML =
        `<div id="miss" class="row">
          <div class="col">
            <span class="notification-label">MISS</span>
            <div class="notification-message">${message}</div>
          </div>

          <div class="col-4">
            <img class="img-fluid" src="/img/miss2.gif"/>
          </div>
        </div>`;

      return missNotification;
    }

    function createHitNotification(message){
      let hitNotification = document.createElement('div');
      hitNotification.setAttribute('id', 'game-notification-item');
      hitNotification.style.display = 'none';
      hitNotification.innerHTML = 
        `<div id="hit" class="row">
           <div class="col">
             <span class="notification-label">HIT</span>
              <div class="notification-message">${message}</div>
           </div>

          <div class="col-4">
            <img class="img-fluid" src="/img/explosion2.gif"/>
          </div>
        </div>`;

      return hitNotification;
    }

  }

  // PHASE 2 END //
}
