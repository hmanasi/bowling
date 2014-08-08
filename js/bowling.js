(function(){

	var Frame= function () {
		this.turnsRemaining = 2;
		this.turnsTaken = 0;
		this.score = 0;
		this.pinsRemaining = 10;
	};

	Frame.prototype = {

		turnTaken: function (pins) {
			this.score += pins;
			this.turnsTaken++;
			this.turnsRemaining--;
			this.pinsRemaining -= pins;

			if(this.score == 10 && this.turnsTaken ==1) {
				this.turnsRemaining ++;
				this.pinsRemaining = 10;
			}
			else if(this.score == 10 && this.turnsTaken ==2) {
				this.turnsRemaining ++;
				this.pinsRemaining = 10;
			}

		},

		hasMoreTurns: function () {
			return (this.turnsRemaining > 0);
		}

	};

	var Player= function () {
		this.totalScore = 0;
	};

	Player.prototype = {

		addScore: function (score) {
			this.totalScore += score;
		},

		getScore: function () {
			return this.totalScore;
		}
	};

	var Game = function (noPlayers) {
		this.currentPlayer = 0;
		this.frame = new Frame();
		this.nPlayers = noPlayers;
		this.players = [];
		this.currentRound = 0;
		this.gameOver = false;

		for(i=0; i<this.nPlayers; i++) {
			this.players[i]= new Player();
		};

	};

	Game.prototype = {
		getAllScores: function () {
			return this.players;
		}, 

		turnTaken: function (pins) {
			this.frame.turnTaken(pins);
			this.players[this.currentPlayer].addScore(pins);
			if(!this.frame.hasMoreTurns()) {

				this.currentPlayer ++;

				if (this.currentPlayer >= this.nPlayers)
				{
					this.currentPlayer = 0;
					this.currentRound ++;

					if (this.currentRound >= 11) {
						this.gameOver = true;
					}
				}

				this.frame = new Frame();
			}
		},

		getPinsRemaining: function () {
			return this.frame.pinsRemaining;
		},

		getTurnsRemaining: function () {
			return this.frame.turnsRemaining;
		}
	};

	var game;
	var players;
	
	function displayStatus(players){
		for(i=0,j=1; i<players; i++,j++) {
			$('#player' + j + 'score').html('  ' + (game.players[i].getScore()));
		};
		$('#round').html('  ' + (game.currentRound+1));
		$('#currentPlayer').html('  ' + (game.currentPlayer+1));
		$('#pinsRemaining').html('  ' + (game.getPinsRemaining()));
		$('#turnsRemaining').html('  ' + (game.getTurnsRemaining()));
	}

	$(document).ready(function(){

		$('#numberofPlayers').click(function(e) {
			e.preventDefault();
			$('.enterNumberofPlayers').addClass('hidden');
			$('#gamePanelId').removeClass('hidden');
			$('#noofPlayersError').html('');
			players= $('#players').val().trim();
			if(isNaN(players) || players > 5 || players<= 0 || players == 0) {
				$('#noofPlayersError').html('<img src="img/error.png" alt="error"/>' + ' Upto 5 players are allowed' );
				$('.enterNumberofPlayers').removeClass('hidden');
				$('#gamePanelId').addClass('hidden');
				$('#players').val('').focus();
			}
			else {
				game= new Game(players);
				$("#players").val('');
				$('.players').html('<h2>Score Board</h2>' + 
								'<h1>Round:<span id="round"></span></h1>' +
								'<div id="table">' + 
								'<div class="row" id="playerNumber">' + '</div>'  + 
								'<div class="row" id="playerScore">' + '</div>' + 
								'</div>');
				for(i=1; i<=players; i++) {
				$('#playerNumber').append('<div class="cell">Player' + i + '</div>');
				$('#playerScore').append('<div class="cell" id="player' + i + 'score">' + '</div>');
				};
				displayStatus(players);


			}


		});

		$('#pinsDown').click(function(e){
			e.preventDefault();
			$('#pinsError').html('');
			$('#pins').focus();	
			var pins= parseInt($('#pins').val());
			if(pins <= game.getPinsRemaining()) {
				game.turnTaken(pins);
			}
			else {
				$('#pinsError').html('<img src="img/error.png" alt="error"/>' + ' Only' + game.getPinsRemaining() + ' pins are remaining' );
			}
			

			displayStatus(players);
			$('#pins').val('');
		});
	});

})();