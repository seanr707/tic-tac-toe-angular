// Solution by Seanr707 completed for submission on 08/28/2015, 11:04AM
// Solution is not for use, redistribution, or modification without author's explicit, written permission.
var app = angular.module('ttt', []);

app.controller('ctrl', ['$scope', '$interval',
  function($scope, $interval) {
    $scope.letters = ['X', 'O'];
    // Human an CPU store as X or O
    $scope.human;
    $scope.cpu;
    // Winning/Losing Message
    $scope.message;
    // Whether someone has chosen X or O
    $scope.choice = false;
    // Whose turn it is
    $scope.turn;
    // Count turns til 9 (end)
    $scope.countTurn = 0;
    $scope.time = 3;
    // Have you won yet?
    $scope.win = false;
    $scope.top = {
      left: {
        name: 'left',
        val: '-',
        filled: false,
        owner: '',
      },
      center: {
        name: 'center',
        val: '-',
        filled: false,
        owner: '',
      },
      right: {
        name: 'right',
        val: '-',
        filled: false,
        owner: '',
      },
    };
    $scope.mid = {
      left: {
        name: 'left',
        val: '-',
        filled: false,
        owner: '',
      },
      center: {
        name: 'center',
        val: '-',
        filled: false,
        owner: '',
      },
      right: {
        name: 'right',
        val: '-',
        filled: false,
        owner: '',
      },
    };
    $scope.bottom = {
      left: {
        name: 'left',
        val: '-',
        filled: false,
        owner: '',
      },
      center: {
        name: 'center',
        val: '-',
        filled: false,
        owner: '',
      },
      right: {
        name: 'right',
        val: '-',
        filled: false,
        owner: '',
      },
    };
    // These were not put in scope because they are only needed within
    // Used to simplify looping through tiles to check on them
    var rows = {
      0: 'top',
      1: 'mid',
      2: 'bottom',
    };
    var tiles = {
      0: 'left',
      1: 'center',
      2: 'right',
    };
    // Move Order for CPU, more is added after Human's first move
    var moveOrder;

    // Choose X or O
    $scope.choose = function(choice) {
      if (choice === 'X') {
        $scope.human = 'X';
        $scope.cpu = 'O';
      } else {
        $scope.human = 'O';
        $scope.cpu = 'X';
      }
      // Hide display and start CPU Turn
      $scope.choice = true;
      // Ensures that CPU always goes first
      $scope.turn = 'cpu';
      $scope.sim();
    }

    $scope.sim = function() { 
      // Prevents more than one move per turn
      var foundBlock = false;
      // Default moveset; others done if Human makes specific first move
      var moveOrder1 = [
        [1, 1], [2, 2],
        [0, 0], [0, 2],
        [1, 2], [2, 0],
        [1, 0], [2, 1],
        [0, 1],
      ];
      // For top-left or mid-left tile selected
      var moveOrder2 = [
        [1, 1], [2, 0],
        [0, 2], [0, 1],
        [2, 1], [1, 2],
        [1, 0], [2, 2],
        [0, 0],
      ];
      // For bottom-right tile selected
      var moveOrder3 = [
        [1, 1], [2, 2],
        [2, 0], [0, 2],
        [1, 2], [1, 0],
        [2, 1], [0, 1],
        [0, 0],
      ];
      // For bottom-left tile selected
      var moveOrder4 = [
        [1, 1], [0, 0],
        [2, 0], [2, 2],
        [2, 1], [0, 1],
        [0, 2], [1, 0],
        [1, 2],
      ];
      // For top-right tile selected
      var moveOrder5 = [
        [1, 1], [2, 2],
        [0, 0], [0, 1],
        [2, 1], [1, 0],
        [1, 2], [2, 0],
        [0, 2],
      ];
      // Only changes moveOrder within first 3 turns (After user's first turn [2])
      if ($scope.countTurn <= 3 ) {
        if (($scope.top.left.filled && $scope.top.left.owner === 'human') ||
            ($scope.mid.left.filled && $scope.mid.left.owner === 'human')) {
          moveOrder = moveOrder2;
        } else if ($scope.bottom.right.filled && $scope.bottom.right.owner === 'human') {
          moveOrder = moveOrder3;
        } else if ($scope.bottom.left.filled && $scope.bottom.left.owner === 'human') {
          moveOrder = moveOrder4;
        } else if ($scope.top.right.filled && $scope.top.right.owner === 'human') {
          moveOrder = moveOrder5;
        } else {
          moveOrder = moveOrder1;
        }
      }
      // If block isn't filled and CPU hasn't moved yet, places mark at tile from moveOrder
      moveOrder.forEach(function(item) {
        if ($scope[rows[item[0]]][tiles[item[1]]].filled === false && foundBlock === false) {
          foundBlock = true;
          $scope.add($scope[rows[item[0]]][tiles[item[1]]].name, rows[item[0]], $scope.cpu);
        }
      });
    }
    // Main function for adding marks | place (i.e. left), level (i.e. bottom), who (i.e. 'X')
    $scope.add = function(place, level, who) {
      // No moves if tile is already filled
      if ($scope[level][place].filled) return;
      // No moves if the game is over
      if ($scope.win) return;

      // Put X or O in tile
      $scope[level][place].val = who;
      $scope[level][place].filled = true;
      // Set owner of tile (Human or CPU)
      $scope[level][place].owner = $scope.turn;

      $scope.countTurn += 1;

      // Check for a winner and prevents continuation if someone won
      if (winCheck($scope.turn)) return;

      // Switches turn
      if ($scope.turn === 'cpu') {
        $scope.turn = 'human';
      } else {
        $scope.turn = 'cpu';
        $scope.sim();
      }
    }

    // Resets board to default values
    $scope.reset = function() {
      var rows = ['top', 'mid', 'bottom'];
      // Stops timer if reset early
      $scope.stopTimer();
      // Goes through each row
      rows.forEach(function(item) {
        // Creates and loops through each tile in row
        Object.keys($scope[item]).forEach(function(subitem) {
          $scope[item][subitem].val = '-';
          $scope[item][subitem].filled = false;
          $scope[item][subitem].owner = '';
        });
      });

      $scope.countTurn = 0;
      $scope.win = false;
      // User chooses X or O again
      $scope.choice = false;
      // Reset timer
      $scope.time = 3;
    }

    // Timer (Took forever to realize to use $interval instead of setInterval)
    // Only runs if 'stop' is undefined to prevent too many intervals at once
    var stop;
    $scope.timer = function() {
      if ( angular.isDefined(stop) ) return;

      stop = $interval(function() {
        if ($scope.time > 1) {
          $scope.time -= 1;
        } else {
          $scope.stopTimer();
          // Resets game after 3 seconds
          $scope.reset();
        }
        // Sets a max of 5 loops just in case something breaks
      }, 1000, 5);
    }
    // Used for stopping $scope.timer()
    $scope.stopTimer = function() {
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    // Checks for a victory/loss, takes input 'human' or 'CPU'
    function winCheck(who) {
      var winCombo = [
        // 3 in a Row
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // 3 in a Col.
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // 3 in a Diag.
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],
      ];

      // Go through each possible victory trio
      winCombo.forEach(function(item) {
        var winCount = 0;
        // Go through each tile (Row, Col)
        item.forEach(function(sub) {
          // Increase winCount if all 3 are filled by the same owner
          if ($scope.win === false &&
              winCount <= 3 &&
              $scope[rows[sub[0]]][tiles[sub[1]]].filled &&
              $scope[rows[sub[0]]][tiles[sub[1]]].owner === who) {
            winCount += 1;
          }
        });
        // If 3 in a row then someone has won
        if (winCount === 3) $scope.win = true;
      });

      // Adjusts the message that pops up
      if ($scope.win) {
        $scope.message = who[0].toUpperCase() + who.substr(1, who.length) + " Wins!";
        // Begins reset timer
        $scope.timer();
      } else if ($scope.countTurn === 9) {
        $scope.message = "It's a tie...";
        // This is set to true just as an easy way to display popup
        $scope.win = true;
        $scope.timer();
      }
      // Returns true or false to $scope.add()
      return $scope.win;
    }
  }
]);