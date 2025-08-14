// Game State Management
class GameManager {
    constructor() {
        this.currentGame = null;
        this.currentPlayer = null;
        this.games = this.loadGames();
        this.players = this.loadPlayers();
        this.gameHistory = this.loadGameHistory();
        this.gameRounds = this.loadGameRounds();
        this.init();
    }

    init() {
        console.log('Initializing GameManager...');
        this.setupEventListeners();
        this.setupNavigation();
        this.updateActiveGamesList();
        this.updateGameHistory();
        this.updatePlayerStats();
        console.log('GameManager initialization complete');
    }

    // Data Storage Methods (LocalStorage)
    loadGames() {
        const games = localStorage.getItem('truthLieGames');
        return games ? JSON.parse(games) : {};
    }

    saveGames() {
        localStorage.setItem('truthLieGames', JSON.stringify(this.games));
    }

    loadPlayers() {
        const players = localStorage.getItem('truthLiePlayers');
        return players ? JSON.parse(players) : {};
    }

    savePlayers() {
        localStorage.setItem('truthLiePlayers', JSON.stringify(this.players));
    }

    loadGameHistory() {
        const history = localStorage.getItem('truthLieGameHistory');
        return history ? JSON.parse(history) : [];
    }

    saveGameHistory() {
        localStorage.setItem('truthLieGameHistory', JSON.stringify(this.gameHistory));
    }

    // Game Creation and Management
    saveGameDraft() {
        // Only employee name is required for draft
        const employeeName = document.getElementById('employee-name').value.trim();
        
        if (!employeeName) {
            this.showModal('Error', 'Please enter at least the employee name to save a draft.');
            return;
        }

        // Get all form values
        const statement1Title = document.getElementById('statement1-title').value.trim();
        const statement1Content = document.getElementById('statement1-content').value.trim();
        const statement2Title = document.getElementById('statement2-title').value.trim();
        const statement2Content = document.getElementById('statement2-content').value.trim();
        const statement3Title = document.getElementById('statement3-title').value.trim();
        const statement3Content = document.getElementById('statement3-content').value.trim();
        const lieStatement = document.querySelector('input[name="lie-statement"]:checked');
        const department = document.getElementById('employee-department').value.trim();
        const introducer = document.getElementById('introducer-name').value.trim();
        const pictureFile = document.getElementById('employee-picture').files[0];

        // Create draft game round data
        const gameRound = {
            id: this.generateGameRoundId(),
            employeeName: employeeName,
            department: department || 'Not specified',
            introducer: introducer || 'Not specified',
            picture: pictureFile ? this.processImageFile(pictureFile) : null,
            statements: [
                {
                    id: 1,
                    title: statement1Title,
                    content: statement1Content,
                    isLie: lieStatement ? lieStatement.value === '1' : false
                },
                {
                    id: 2,
                    title: statement2Title,
                    content: statement2Content,
                    isLie: lieStatement ? lieStatement.value === '2' : false
                },
                {
                    id: 3,
                    title: statement3Title,
                    content: statement3Content,
                    isLie: lieStatement ? lieStatement.value === '3' : false
                }
            ],
            lieIndex: lieStatement ? parseInt(lieStatement.value) - 1 : -1,
            createdAt: new Date().toISOString(),
            status: 'draft', // draft, active, finished
            votes: [],
            results: null,
            isComplete: this.isGameRoundComplete()
        };

        // Store the game round
        if (!this.gameRounds) {
            this.gameRounds = [];
        }
        this.gameRounds.push(gameRound);
        this.saveGameRounds();

        // Clear the form
        this.clearGameRoundForm();

        this.showModal('Draft Saved!', `Draft saved for <strong>${employeeName}</strong>!<br><br>You will be redirected to the Game Administration overview.`);
        
        // Update admin overview
        this.updateAdminOverview();
        
        // Navigate back to game administration section
        setTimeout(() => {
            this.switchAdminSection('game-administration');
        }, 1500);
    }

    cancelGameDraft() {
        if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            this.clearGameRoundForm();
            this.switchAdminSection('game-administration');
        }
    }

    activateGameFromDraft() {
        // Validate that all mandatory fields are complete
        if (!this.isGameRoundComplete()) {
            this.showModal('Error', 'Please complete all mandatory fields before activating the game.');
            return;
        }

        // Get current form data
        const employeeName = document.getElementById('employee-name').value.trim();
        const statement1Title = document.getElementById('statement1-title').value.trim();
        const statement2Title = document.getElementById('statement2-title').value.trim();
        const statement3Title = document.getElementById('statement3-title').value.trim();
        const lieStatement = document.querySelector('input[name="lie-statement"]:checked');

        // Create active game round
        const gameRound = {
            id: this.generateGameRoundId(),
            employeeName: employeeName,
            department: document.getElementById('employee-department').value.trim() || 'Not specified',
            introducer: document.getElementById('introducer-name').value.trim() || 'Not specified',
            picture: document.getElementById('employee-picture').files[0] ? this.processImageFile(document.getElementById('employee-picture').files[0]) : null,
            statements: [
                {
                    id: 1,
                    title: statement1Title,
                    content: document.getElementById('statement1-content').value.trim(),
                    isLie: lieStatement.value === '1'
                },
                {
                    id: 2,
                    title: statement2Title,
                    content: document.getElementById('statement2-content').value.trim(),
                    isLie: lieStatement.value === '2'
                },
                {
                    id: 3,
                    title: statement3Title,
                    content: document.getElementById('statement3-content').value.trim(),
                    isLie: lieStatement.value === '3'
                }
            ],
            lieIndex: parseInt(lieStatement.value) - 1,
            createdAt: new Date().toISOString(),
            status: 'active',
            startedAt: new Date().toISOString(),
            votes: [],
            results: null
        };

        // Store the game round
        if (!this.gameRounds) {
            this.gameRounds = [];
        }
        this.gameRounds.push(gameRound);
        this.saveGameRounds();

        // Clear the form
        this.clearGameRoundForm();

        this.showModal('Game Activated!', `Game activated for <strong>${employeeName}</strong>!<br><br>The game is now active and ready to be played.`);
        
        // Update admin overview
        this.updateAdminOverview();
    }

    isGameRoundComplete() {
        const employeeName = document.getElementById('employee-name').value.trim();
        const statement1Title = document.getElementById('statement1-title').value.trim();
        const statement2Title = document.getElementById('statement2-title').value.trim();
        const statement3Title = document.getElementById('statement3-title').value.trim();
        const lieStatement = document.querySelector('input[name="lie-statement"]:checked');

        return employeeName && statement1Title && statement2Title && statement3Title && lieStatement;
    }






        // Get optional fields
        const department = document.getElementById('employee-department').value.trim();
        const introducer = document.getElementById('introducer-name').value.trim();

        // Create preview content
        const previewContent = `
            <div class="preview-content">
                <h3>Preview: ${employeeName}</h3>
                ${department ? `<p><strong>Department:</strong> ${department}</p>` : ''}
                ${introducer ? `<p><strong>Introduced by:</strong> ${introducer}</p>` : ''}
                
                <div class="statements-preview">
                    <h4>Statements:</h4>
                    <div class="statement-preview">
                        <strong>1. ${statement1Title}</strong>
                        ${statement1Content ? `<p>${statement1Content}</p>` : '<p class="no-content">No additional content</p>'}
                        ${lieStatement.value === '1' ? '<span class="lie-indicator">[LIE]</span>' : ''}
                    </div>
                    <div class="statement-preview">
                        <strong>2. ${statement2Title}</strong>
                        ${statement2Content ? `<p>${statement2Content}</p>` : '<p class="no-content">No additional content</p>'}
                        ${lieStatement.value === '2' ? '<span class="lie-indicator">[LIE]</span>' : ''}
                    </div>
                    <div class="statement-preview">
                        <strong>3. ${statement3Title}</strong>
                        ${statement3Content ? `<p>${statement3Content}</p>` : '<p class="no-content">No additional content</p>'}
                        ${lieStatement.value === '3' ? '<span class="lie-indicator">[LIE]</span>' : ''}
                    </div>
                </div>
            </div>
        `;

        this.showModal('Game Round Preview', previewContent);
    }

    clearGameRoundForm() {
        document.getElementById('employee-name').value = '';
        document.getElementById('statement1-title').value = '';
        document.getElementById('statement1-content').value = '';
        document.getElementById('statement2-title').value = '';
        document.getElementById('statement2-content').value = '';
        document.getElementById('statement3-title').value = '';
        document.getElementById('statement3-content').value = '';
        document.getElementById('employee-department').value = '';
        document.getElementById('introducer-name').value = '';
        document.getElementById('employee-picture').value = '';
        
        // Clear radio buttons
        document.querySelectorAll('input[name="lie-statement"]').forEach(radio => {
            radio.checked = false;
        });
    }

    processImageFile(file) {
        // Basic file validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showModal('Error', 'Image file is too large. Please use an image under 5MB.');
            return null;
        }

        // For now, we'll store the file name and size
        // In a real implementation, you might want to upload to a server or convert to base64
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        };
    }

    generateGameRoundId() {
        return 'round_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveGameRounds() {
        localStorage.setItem('truthLieGameRounds', JSON.stringify(this.gameRounds));
    }

    loadGameRounds() {
        const rounds = localStorage.getItem('truthLieGameRounds');
        return rounds ? JSON.parse(rounds) : [];
    }

    joinGame(playerName, gameCode) {
        if (!playerName.trim() || !gameCode.trim()) {
            this.showModal('Error', 'Please enter both player name and game code.');
            return;
        }

        const game = this.games[gameCode.toUpperCase()];
        if (!game) {
            this.showModal('Error', 'Game not found. Please check the game code.');
            return;
        }

        if (game.status !== 'waiting') {
            this.showModal('Error', 'This game has already started or finished.');
            return;
        }

        if (game.players.length >= 8) {
            this.showModal('Error', 'This game is full (maximum 8 players).');
            return;
        }

        const playerId = this.generatePlayerId();
        const newPlayer = {
            id: playerId,
            name: playerName.trim(),
            isHost: false,
            isCurrentTurn: false,
            statements: null,
            votes: [],
            score: 0
        };

        game.players.push(newPlayer);
        this.saveGames();

        // Add player to players list
        this.players[playerId] = {
            id: playerId,
            name: playerName.trim(),
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            bestScore: 0,
            lastPlayed: new Date().toISOString()
        };
        this.savePlayers();

        this.currentGame = game;
        this.currentPlayer = newPlayer;
        
        this.showModal('Joined Game!', `Successfully joined game ${gameCode}!`);
        
        this.navigateToPage('game');
        this.updateGameDisplay();
    }

    startGame() {
        if (!this.currentGame || !this.currentPlayer.isHost) {
            return;
        }

        if (this.currentGame.players.length < 2) {
            this.showModal('Error', 'Need at least 2 players to start the game.');
            return;
        }

        this.currentGame.status = 'active';
        this.currentGame.startedAt = new Date().toISOString();
        this.currentGame.maxRounds = this.currentGame.players.length;
        this.currentGame.currentPlayerIndex = 0;
        this.currentGame.players[0].isCurrentTurn = true;
        
        this.saveGames();
        this.updateGameDisplay();
    }

    // Game Logic
    submitStatements(statement1, statement2, statement3) {
        if (!this.currentGame || !this.currentPlayer) return;

        const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
        if (currentPlayer.id !== this.currentPlayer.id) {
            this.showModal('Error', 'It\'s not your turn yet.');
            return;
        }

        if (!statement1.trim() || !statement2.trim() || !statement3.trim()) {
            this.showModal('Error', 'Please fill in all three statements.');
            return;
        }

        // Randomly shuffle the statements so the lie position is unknown
        const statements = [statement1.trim(), statement2.trim(), statement3.trim()];
        const lieIndex = Math.floor(Math.random() * 3);
        
        currentPlayer.statements = {
            statements: statements,
            lieIndex: lieIndex,
            submitted: true
        };

        this.saveGames();
        this.nextTurn();
    }

    nextTurn() {
        if (!this.currentGame) return;

        const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
        
        // If all players have submitted statements, start voting
        if (this.currentGame.currentPlayerIndex === this.currentGame.players.length - 1) {
            this.startVoting();
        } else {
            // Move to next player
            currentPlayer.isCurrentTurn = false;
            this.currentGame.currentPlayerIndex++;
            this.currentGame.players[this.currentGame.currentPlayerIndex].isCurrentTurn = true;
            this.saveGames();
            this.updateGameDisplay();
        }
    }

    startVoting() {
        if (!this.currentGame) return;

        this.currentGame.status = 'voting';
        this.saveGames();
        this.updateGameDisplay();
    }

    submitVote(statementIndex) {
        if (!this.currentGame || !this.currentPlayer) return;

        // Check if player already voted
        const existingVote = this.currentPlayer.votes.find(vote => 
            vote.round === this.currentGame.currentRound
        );

        if (existingVote) {
            this.showModal('Error', 'You have already voted in this round.');
            return;
        }

        this.currentPlayer.votes.push({
            round: this.currentGame.currentRound,
            statementIndex: statementIndex,
            timestamp: new Date().toISOString()
        });

        this.saveGames();

        // Check if all players have voted
        const allVoted = this.currentGame.players.every(player => 
            player.votes.some(vote => vote.round === this.currentGame.currentRound)
        );

        if (allVoted) {
            this.calculateRoundResults();
        }

        this.updateGameDisplay();
    }

    calculateRoundResults() {
        if (!this.currentGame) return;

        const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
        const lieIndex = currentPlayer.statements.lieIndex;
        
        let correctVotes = 0;
        let totalVotes = 0;

        this.currentGame.players.forEach(player => {
            const vote = player.votes.find(v => v.round === this.currentGame.currentRound);
            if (vote) {
                totalVotes++;
                if (vote.statementIndex === lieIndex) {
                    correctVotes++;
                    player.score += 10; // Points for guessing correctly
                }
            }
        });

        // Points for the statement giver
        const difficultyBonus = Math.max(0, 10 - correctVotes * 2); // More points if fewer people guessed correctly
        currentPlayer.score += difficultyBonus;

        const roundResult = {
            round: this.currentGame.currentRound,
            playerName: currentPlayer.name,
            statements: currentPlayer.statements.statements,
            lieIndex: lieIndex,
            correctVotes: correctVotes,
            totalVotes: totalVotes,
            playerScore: currentPlayer.score,
            difficultyBonus: difficultyBonus
        };

        this.currentGame.roundResults.push(roundResult);
        this.currentGame.currentRound++;

        // Check if game is finished
        if (this.currentGame.currentRound >= this.currentGame.maxRounds) {
            this.finishGame();
        } else {
            // Reset for next round
            this.currentGame.players.forEach(player => {
                player.statements = null;
                player.isCurrentTurn = false;
            });
            this.currentGame.currentPlayerIndex = 0;
            this.currentGame.players[0].isCurrentTurn = true;
            this.currentGame.status = 'active';
        }

        this.saveGames();
        this.updateGameDisplay();
    }

    finishGame() {
        if (!this.currentGame) return;

        this.currentGame.status = 'finished';
        this.currentGame.finishedAt = new Date().toISOString();

        // Calculate final scores and winner
        let winner = null;
        let highestScore = -1;

        this.currentGame.players.forEach(player => {
            if (player.score > highestScore) {
                highestScore = player.score;
                winner = player;
            }
        });

        // Update player statistics
        this.currentGame.players.forEach(player => {
            const playerStats = this.players[player.id];
            if (playerStats) {
                playerStats.gamesPlayed++;
                playerStats.totalScore += player.score;
                playerStats.bestScore = Math.max(playerStats.bestScore, player.score);
                playerStats.lastPlayed = new Date().toISOString();
                
                if (player.id === winner.id) {
                    playerStats.gamesWon++;
                }
            }
        });

        // Add to game history
        const gameResult = {
            gameId: this.currentGame.id,
            gameCode: this.currentGame.code,
            players: this.currentGame.players.map(p => ({
                name: p.name,
                score: p.score
            })),
            winner: winner.name,
            winnerScore: winner.score,
            totalRounds: this.currentGame.maxRounds,
            finishedAt: this.currentGame.finishedAt
        };

        this.gameHistory.unshift(gameResult);
        if (this.gameHistory.length > 50) { // Keep only last 50 games
            this.gameHistory = this.gameHistory.slice(0, 50);
        }

        this.saveGames();
        this.savePlayers();
        this.saveGameHistory();

        this.showModal('Game Finished!', `Congratulations to <strong>${winner.name}</strong> for winning with ${winner.score} points!`);
        
        this.updateGameDisplay();
        this.updateGameHistory();
        this.updatePlayerStats();
    }

    // Utility Methods
    generateGameCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // UI Update Methods
    updateGameDisplay() {
        if (!this.currentGame) return;

        // Update game info
        document.getElementById('current-game-code').textContent = this.currentGame.code;
        document.getElementById('player-count').textContent = this.currentGame.players.length;

        // Update players list
        this.updatePlayersList();

        // Update game status
        this.updateGameStatus();

        // Update game round
        this.updateGameRound();
    }

    // Update active games display for Game Room
    updateActiveGamesDisplay() {
        const activeGamesList = document.getElementById('active-games-list');
        const noActiveGames = document.getElementById('no-active-games');
        
        if (!this.gameRounds || this.gameRounds.length === 0) {
            activeGamesList.style.display = 'none';
            noActiveGames.style.display = 'block';
            return;
        }
        
        const activeGames = this.gameRounds.filter(round => round.status === 'active');
        
        if (activeGames.length === 0) {
            activeGamesList.style.display = 'none';
            noActiveGames.style.display = 'block';
            return;
        }
        
        activeGamesList.style.display = 'block';
        noActiveGames.style.display = 'none';
        
        activeGamesList.innerHTML = activeGames.map(game => this.renderGameCard(game)).join('');
        
        // Add event listeners to voting buttons
        this.setupVotingEventListeners();
    }

    // Render individual game card
    renderGameCard(game) {
        const avatarContent = game.picture ? 
            `<img src="${game.picture}" alt="${game.employeeName}" />` : 
            game.employeeName.charAt(0).toUpperCase();
        
        return `
            <div class="game-card" data-game-id="${game.id}">
                <div class="employee-info">
                    <div class="employee-avatar">
                        ${avatarContent}
                    </div>
                    <div class="employee-details">
                        <h3>${game.employeeName}</h3>
                        <p>Department: ${game.department}</p>
                        <p>Introduced by: ${game.introducer}</p>
                    </div>
                </div>
                
                <div class="statements-display">
                    ${game.statements.map((statement, index) => `
                        <div class="statement-card" data-statement="${index + 1}">
                            <div class="statement-number">${index + 1}</div>
                            <div class="statement-title">${statement.title}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="voting-section">
                    <div class="voting-instructions">Click on a statement to vote for the lie:</div>
                    <div class="voting-buttons">
                        <button class="vote-btn" data-game="${game.id}" data-statement="1">Vote Statement 1</button>
                        <button class="vote-btn" data-game="${game.id}" data-statement="2">Vote Statement 2</button>
                        <button class="vote-btn" data-game="${game.id}" data-statement="3">Vote Statement 3</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup voting event listeners
    setupVotingEventListeners() {
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameId = e.target.dataset.game;
                const statementIndex = parseInt(e.target.dataset.statement) - 1;
                this.submitVoteForGame(gameId, statementIndex);
            });
        });
    }

    // Submit vote for a specific game
    submitVoteForGame(gameId, statementIndex) {
        // Get or create player ID from localStorage
        let playerId = localStorage.getItem('truthLiePlayerId');
        if (!playerId) {
            playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('truthLiePlayerId', playerId);
        }
        
        // Find the game
        const game = this.gameRounds.find(g => g.id === gameId);
        if (!game) {
            this.showModal('Error', 'Game not found.');
            return;
        }
        
        // Check if player already voted
        const existingVote = game.votes.find(v => v.playerId === playerId);
        if (existingVote) {
            this.showModal('Info', 'You have already voted in this game.');
            return;
        }
        
        // Add vote
        if (!game.votes) game.votes = [];
        game.votes.push({
            playerId: playerId,
            statementIndex: statementIndex,
            timestamp: new Date().toISOString()
        });
        
        // Save to localStorage
        this.saveGameRounds();
        
        // Update UI to show voted state
        this.updateVoteButtonState(gameId, statementIndex);
        
        this.showModal('Vote Submitted!', `You voted for Statement ${statementIndex + 1} as the lie.`);
    }

    // Update vote button state
    updateVoteButtonState(gameId, statementIndex) {
        const gameCard = document.querySelector(`[data-game-id="${gameId}"]`);
        if (!gameCard) return;
        
        // Remove voted class from all buttons
        gameCard.querySelectorAll('.vote-btn').forEach(btn => btn.classList.remove('voted'));
        
        // Add voted class to selected button
        const selectedBtn = gameCard.querySelector(`[data-statement="${statementIndex + 1}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('voted');
        }
    }

    // Admin Section Management
    switchAdminSection(sectionName) {
        // Update subnavigation buttons
        document.querySelectorAll('.subnav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Load section-specific content
        switch(sectionName) {
            case 'game-administration':
                this.updateAdminOverview();
                break;
            case 'game-history':
                this.loadGameHistory();
                break;
            case 'data-export':
                this.loadExportOptions();
                break;
        }
    }

    updatePlayersList() {
        if (!this.currentGame) return;

        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';

        this.currentGame.players.forEach((player, index) => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            
            const avatar = document.createElement('div');
            avatar.className = 'player-avatar';
            avatar.textContent = player.name.charAt(0).toUpperCase();

            const playerName = document.createElement('div');
            playerName.className = 'player-name';
            playerName.textContent = player.name;

            const playerStatus = document.createElement('div');
            playerStatus.className = 'player-status';
            
            if (player.isHost) {
                playerStatus.textContent = 'Host';
            } else if (player.isCurrentTurn) {
                playerStatus.textContent = 'Current Turn';
            } else if (player.statements) {
                playerStatus.textContent = 'Ready';
            } else {
                playerStatus.textContent = 'Waiting';
            }

            playerItem.appendChild(avatar);
            playerItem.appendChild(playerName);
            playerItem.appendChild(playerStatus);
            playersList.appendChild(playerItem);
        });
    }

    updateGameStatus() {
        if (!this.currentGame) return;

        const statusMessage = document.getElementById('game-status-message');
        const startGameBtn = document.getElementById('start-game-btn');

        if (this.currentGame.status === 'waiting') {
            statusMessage.textContent = `Waiting for players to join... (${this.currentGame.players.length}/8)`;
            startGameBtn.style.display = this.currentPlayer.isHost ? 'inline-block' : 'none';
        } else if (this.currentGame.status === 'active') {
            const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
            statusMessage.textContent = `Game in progress! ${currentPlayer.name}'s turn.`;
            startGameBtn.style.display = 'none';
        } else if (this.currentGame.status === 'voting') {
            statusMessage.textContent = 'Voting in progress!';
            startGameBtn.style.display = 'none';
        } else if (this.currentGame.status === 'finished') {
            statusMessage.textContent = 'Game finished!';
            startGameBtn.style.display = 'none';
        }
    }

    updateGameRound() {
        if (!this.currentGame) return;

        const gameRound = document.getElementById('game-round');
        const currentPlayerName = document.getElementById('current-player-name');
        const statementsInput = document.getElementById('statements-input');
        const votingSection = document.getElementById('voting-section');

        if (this.currentGame.status === 'active' || this.currentGame.status === 'voting') {
            gameRound.style.display = 'block';
            
            if (this.currentGame.status === 'active') {
                const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
                currentPlayerName.textContent = currentPlayer.name;

                if (currentPlayer.id === this.currentPlayer.id) {
                    statementsInput.style.display = 'block';
                    votingSection.style.display = 'none';
                } else {
                    statementsInput.style.display = 'none';
                    votingSection.style.display = 'none';
                }
            } else if (this.currentGame.status === 'voting') {
                statementsInput.style.display = 'none';
                votingSection.style.display = 'block';
                this.updateVotingSection();
            }
        } else {
            gameRound.style.display = 'none';
        }
    }

    updateVotingSection() {
        if (!this.currentGame) return;

        const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
        const statementsDisplay = document.getElementById('statements-display');
        
        if (!currentPlayer.statements) return;

        statementsDisplay.innerHTML = '';
        
        currentPlayer.statements.statements.forEach((statement, index) => {
            const statementDiv = document.createElement('div');
            statementDiv.className = 'statement-display';
            statementDiv.textContent = `Statement ${index + 1}: ${statement}`;
            statementsDisplay.appendChild(statementDiv);
        });
    }

    updateActiveGamesList() {
        const activeGamesList = document.getElementById('active-games-list');
        activeGamesList.innerHTML = '';

        Object.values(this.games).forEach(game => {
            if (game.status === 'waiting') {
                const gameItem = document.createElement('div');
                gameItem.className = 'game-item';
                
                gameItem.innerHTML = `
                    <div class="game-item-info">
                        <div class="game-item-code">${game.code}</div>
                        <div class="game-item-players">${game.players.length} players</div>
                    </div>
                    <button class="primary-btn" onclick="gameManager.joinGame('', '${game.code}')">Join</button>
                `;
                
                activeGamesList.appendChild(gameItem);
            }
        });
    }

    updateGameHistory() {
        const gameHistory = document.getElementById('game-history');
        const currentGameResults = document.getElementById('current-game-results');
        
        // Current game results
        if (this.currentGame && this.currentGame.roundResults.length > 0) {
            currentGameResults.innerHTML = '';
            this.currentGame.roundResults.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'result-item';
                resultDiv.innerHTML = `
                    <strong>${result.playerName}</strong> - ${result.correctVotes}/${result.totalVotes} correct guesses
                    <br>Score: ${result.playerScore} (Difficulty bonus: ${result.difficultyBonus})
                `;
                currentGameResults.appendChild(resultDiv);
            });
        } else {
            currentGameResults.innerHTML = '<p>No results yet.</p>';
        }

        // Game history
        gameHistory.innerHTML = '';
        this.gameHistory.slice(0, 10).forEach(game => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <strong>${game.gameCode}</strong> - Winner: ${game.winner} (${game.winnerScore} pts)
                <br>Players: ${game.players.length} | Rounds: ${game.totalRounds}
                <br><small>${new Date(game.finishedAt).toLocaleDateString()}</small>
            `;
            gameHistory.appendChild(historyItem);
        });
    }

    updatePlayerStats() {
        const playerStats = document.getElementById('player-stats');
        playerStats.innerHTML = '';

        Object.values(this.players).forEach(player => {
            const statsDiv = document.createElement('div');
            statsDiv.className = 'player-stats-item';
            statsDiv.innerHTML = `
                <strong>${player.name}</strong>
                <br>Games: ${player.gamesPlayed} | Won: ${player.gamesWon}
                <br>Total Score: ${player.totalScore} | Best: ${player.bestScore}
            `;
            playerStats.appendChild(statsDiv);
        });
    }

    updateAdminOverview() {
        console.log('updateAdminOverview started');
        console.log('this.gameRounds:', this.gameRounds);
        
        // Update statistics
        const draftsCount = this.gameRounds.filter(round => round.status === 'draft').length;
        const activeCount = this.gameRounds.filter(round => round.status === 'active').length;
        const endedCount = this.gameRounds.filter(round => round.status === 'finished').length;

        console.log('Counts - Drafts:', draftsCount, 'Active:', activeCount, 'Ended:', endedCount);

        const draftsCountElement = document.getElementById('drafts-count');
        const activeGamesCountElement = document.getElementById('active-games-count');
        const endedGamesCountElement = document.getElementById('ended-games-count');

        if (draftsCountElement) {
            draftsCountElement.textContent = draftsCount;
        } else {
            console.error('drafts-count element not found');
        }
        
        if (activeGamesCountElement) {
            activeGamesCountElement.textContent = activeCount;
        } else {
            console.error('active-games-count element not found');
        }
        
        if (endedGamesCountElement) {
            endedGamesCountElement.textContent = endedCount;
        } else {
            console.error('ended-games-count element not found');
        }

        // Update drafts list
        console.log('Updating drafts list...');
        this.updateGameList('drafts-list', 'draft', 'No drafts yet. Save your first draft above!');
        
        // Update active games list
        console.log('Updating active games list...');
        this.updateGameList('active-games-list', 'active', 'No active games. Activate a draft to start playing!');
        
        // Update ended games list
        console.log('Updating ended games list...');
        this.updateGameList('ended-games-list', 'finished', 'No finished games yet.');
        
        // Also refresh game room display if it's currently active
        if (document.getElementById('game-page').classList.contains('active')) {
            this.updateActiveGamesDisplay();
        }
    }

    updateGameList(listId, status, emptyMessage) {
        console.log(`updateGameList called with listId: ${listId}, status: ${status}`);
        const listElement = document.getElementById(listId);
        console.log(`Found list element:`, listElement);
        
        if (!listElement) {
            console.error(`List element with id '${listId}' not found`);
            return;
        }
        
        const filteredRounds = this.gameRounds.filter(round => round.status === status);
        console.log(`Filtered rounds for status '${status}':`, filteredRounds);
        
        listElement.innerHTML = '';

        if (filteredRounds.length === 0) {
            listElement.innerHTML = `<p class="no-rounds">${emptyMessage}</p>`;
            return;
        }

        filteredRounds.forEach(round => {
            const roundItem = document.createElement('div');
            roundItem.className = 'game-item';
            
            let statusColor, statusText, actions;
            
            if (status === 'draft') {
                statusColor = '#ffa500';
                statusText = 'Draft';
                actions = `
                    <button class="primary-btn" onclick="gameManager.activateDraft('${round.id}')">Activate</button>
                    <button class="secondary-btn" onclick="gameManager.editDraft('${round.id}')">Edit</button>
                    <button class="secondary-btn" onclick="gameManager.viewGameRoundDetails('${round.id}')">View</button>
                `;
            } else if (status === 'active') {
                statusColor = '#78eac1';
                statusText = 'Active';
                actions = `
                    <button class="secondary-btn" onclick="gameManager.viewGameRoundDetails('${round.id}')">View</button>
                    <button class="secondary-btn" onclick="gameManager.endGameRound('${round.id}')">End</button>
                `;
            } else if (status === 'finished') {
                statusColor = '#666666';
                statusText = 'Finished';
                actions = `
                    <button class="secondary-btn" onclick="gameManager.viewGameRoundDetails('${round.id}')">View</button>
                `;
            }
            
            roundItem.innerHTML = `
                <div class="game-item-info">
                    <div class="game-item-code">${round.employeeName}</div>
                    <div class="game-item-players">${round.department}</div>
                    <div class="game-item-status" style="color: ${statusColor}">${statusText}</div>
                </div>
                <div class="game-item-actions">
                    ${actions}
                </div>
            `;
            
            listElement.appendChild(roundItem);
        });
    }

    viewGameRoundDetails(roundId) {
        const round = this.gameRounds.find(r => r.id === roundId);
        if (!round) return;

        const pictureInfo = round.picture ? 
            `<strong>Picture:</strong> ${round.picture.name} (${Math.round(round.picture.size / 1024)}KB)<br>` : '';

        const gameDetails = `
            <strong>Employee:</strong> ${round.employeeName}<br>
            <strong>Department:</strong> ${round.department}<br>
            <strong>Introduced by:</strong> ${round.introducer}<br>
            <strong>Status:</strong> ${round.status}<br>
            <strong>Created:</strong> ${new Date(round.createdAt).toLocaleString()}<br>
            ${pictureInfo}
            <br><strong>Statements:</strong><br>
            ${round.statements.map((stmt, index) => 
                `${index + 1}. <strong>${stmt.title}</strong>${stmt.isLie ? ' [LIE]' : ''}<br>
                ${stmt.content}<br>`
            ).join('')}
        `;

        this.showModal('Game Round Details', gameDetails);
    }

    editDraft(roundId) {
        const round = this.gameRounds.find(r => r.id === roundId);
        if (!round) return;

        if (round.status !== 'draft') {
            this.showModal('Error', 'Only draft rounds can be edited.');
            return;
        }

        // Populate form with draft data
        document.getElementById('employee-name').value = round.employeeName || '';
        document.getElementById('statement1-title').value = round.statements[0].title || '';
        document.getElementById('statement1-content').value = round.statements[0].content || '';
        document.getElementById('statement2-title').value = round.statements[1].title || '';
        document.getElementById('statement2-content').value = round.statements[1].content || '';
        document.getElementById('statement3-title').value = round.statements[2].title || '';
        document.getElementById('statement3-content').value = round.statements[2].content || '';
        document.getElementById('employee-department').value = round.department || '';
        document.getElementById('introducer-name').value = round.introducer || '';

        // Set radio button for lie
        if (round.lieIndex >= 0) {
            const radioButton = document.querySelector(`input[name="lie-statement"][value="${round.lieIndex + 1}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        }

        // Remove the draft from the list
        this.gameRounds = this.gameRounds.filter(r => r.id !== roundId);
        this.saveGameRounds();

        // Update admin overview
        this.updateAdminOverview();

        // Switch to create-game section
        this.switchAdminSection('create-game');

        this.showModal('Draft Loaded', `Draft for <strong>${round.employeeName}</strong> loaded into the form. Complete the information and save as a new draft when ready.`);
    }

    activateDraft(roundId) {
        const round = this.gameRounds.find(r => r.id === roundId);
        if (!round) return;

        if (round.status !== 'draft') {
            this.showModal('Error', 'Only draft rounds can be activated.');
            return;
        }

        // Check if the draft is complete enough to activate
        if (!round.employeeName || !round.statements[0].title || !round.statements[1].title || 
            !round.statements[2].title || round.lieIndex === -1) {
            this.showModal('Error', 'Cannot activate draft. Please ensure all mandatory fields are completed: Employee Name, Statement Titles, and Lie Selection.');
            return;
        }

        // Change status to active
        round.status = 'active';
        round.activatedAt = new Date().toISOString();
        this.saveGameRounds();

        this.showModal('Game Activated!', `Game round for <strong>${round.employeeName}</strong> has been activated and is now available for players to vote on!`);
        
        // Update admin overview
        this.updateAdminOverview();
    }

    endGameRound(roundId) {
        const round = this.gameRounds.find(r => r.id === roundId);
        if (!round) return;

        if (round.status !== 'active') {
            this.showModal('Error', 'Only active rounds can be ended.');
            return;
        }

        if (confirm(`Are you sure you want to end the game round for ${round.employeeName}?`)) {
            // Change status to finished
            round.status = 'finished';
            round.finishedAt = new Date().toISOString();
            this.saveGameRounds();

            this.showModal('Game Ended', `Game round for <strong>${round.employeeName}</strong> has been ended.`);
            
            // Update admin overview
            this.updateAdminOverview();
        }
    }

    clearGameHistory() {
        this.gameHistory = [];
        this.saveGameHistory();
        this.updateAdminOverview();
        this.showModal('Success', 'Game history has been cleared.');
    }

    exportGameData() {
        const exportData = {
            games: this.games,
            players: this.players,
            gameHistory: this.gameHistory,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `truth-lie-game-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showModal('Success', 'Game data has been exported successfully.');
    }

    // Navigation
    setupNavigation() {
        console.log('Setting up navigation...');
        const navBtns = document.querySelectorAll('.nav-btn');
        console.log('Found navigation buttons:', navBtns.length);
        
        navBtns.forEach(btn => {
            console.log('Adding click listener to button:', btn.dataset.page);
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                console.log('Button clicked, navigating to:', page);
                this.navigateToPage(page);
            });
        });
        console.log('Navigation setup complete');
    }

    navigateToPage(pageName) {
        console.log('Navigating to page:', pageName);
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update page visibility
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update content based on page
        if (pageName === 'game') {
            this.updateActiveGamesDisplay();
        } else if (pageName === 'results') {
            this.updateGameHistory();
            this.updatePlayerStats();
        } else if (pageName === 'admin') {
            console.log('Admin page selected, calling updateAdminOverview...');
            try {
                this.updateAdminOverview();
                console.log('updateAdminOverview completed successfully');
            } catch (error) {
                console.error('Error in updateAdminOverview:', error);
            }
        }
        
        console.log('Navigation complete');
    }

    // Event Listeners
    setupEventListeners() {
        // Admin save draft button
        const adminSaveDraftBtn = document.getElementById('admin-save-draft-btn');
        if (adminSaveDraftBtn) {
            adminSaveDraftBtn.addEventListener('click', () => {
                this.saveGameDraft();
            });
        }

        // Admin cancel button
        const adminCancelBtn = document.getElementById('admin-cancel-btn');
        if (adminCancelBtn) {
            adminCancelBtn.addEventListener('click', () => {
                this.cancelGameDraft();
            });
        }

        // Join game button
        const joinGameBtn = document.getElementById('join-game-btn');
        if (joinGameBtn) {
            joinGameBtn.addEventListener('click', () => {
                const playerName = document.getElementById('join-player-name').value;
                const gameCode = document.getElementById('game-code').value;
                this.joinGame(playerName, gameCode);
            });
        }

        // Voting buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('vote-btn')) {
                const statementIndex = parseInt(e.target.dataset.statement) - 1;
                this.submitVote(statementIndex);
            }
        });

        // Modal close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
                this.hideModal();
            }
        });





        const joinPlayerNameInput = document.getElementById('join-player-name');
        if (joinPlayerNameInput) {
            joinPlayerNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const playerName = e.target.value;
                    const gameCode = document.getElementById('game-code').value;
                    this.joinGame(playerName, gameCode);
                }
            });
        }

        const gameCodeInput = document.getElementById('game-code');
        if (gameCodeInput) {
            gameCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const playerName = document.getElementById('join-player-name').value;
                    const gameCode = e.target.value;
                    this.joinGame(playerName, gameCode);
                }
            });
        }

        // Admin page buttons
        const refreshGamesBtn = document.getElementById('refresh-games-btn');
        if (refreshGamesBtn) {
            refreshGamesBtn.addEventListener('click', () => {
                this.updateAdminOverview();
            });
        }

        const clearHistoryBtn = document.getElementById('clear-history-btn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all game history? This action cannot be undone.')) {
                    this.clearGameHistory();
                }
            });
        }

        const exportDataBtn = document.getElementById('export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportGameData();
            });
        }

        // Admin subnavigation event listeners
        document.querySelectorAll('.subnav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchAdminSection(e.target.closest('.subnav-btn').dataset.section);
            });
        });

        // Additional admin button event listeners
        const endActiveGamesBtn = document.getElementById('end-active-games-btn');
        if (endActiveGamesBtn) {
            endActiveGamesBtn.addEventListener('click', () => {
                this.endAllActiveGames();
            });
        }

        const exportHistoryBtn = document.getElementById('export-history-btn');
        if (exportHistoryBtn) {
            exportHistoryBtn.addEventListener('click', () => {
                this.exportGameHistory();
            });
        }

        const clearHistoryBtn2 = document.getElementById('clear-history-btn-2');
        if (clearHistoryBtn2) {
            clearHistoryBtn2.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all game history? This action cannot be undone.')) {
                    this.clearGameHistory();
                }
            });
        }

        const exportAllDataBtn = document.getElementById('export-all-data-btn');
        if (exportAllDataBtn) {
            exportAllDataBtn.addEventListener('click', () => {
                this.exportGameData();
            });
        }

        const exportStatsBtn = document.getElementById('export-stats-btn');
        if (exportStatsBtn) {
            exportStatsBtn.addEventListener('click', () => {
                this.exportGameStats();
            });
        }

        const exportDraftsBtn = document.getElementById('export-drafts-btn');
        if (exportDraftsBtn) {
            exportDraftsBtn.addEventListener('click', () => {
                this.exportDrafts();
            });
        }
    }

    // Modal Management
    showModal(title, content) {
        document.getElementById('modal-title').innerHTML = title;
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal-overlay').style.display = 'flex';
    }

    hideModal() {
        document.getElementById('modal-overlay').style.display = 'none';
    }

    // Missing methods that are referenced in event listeners
    endAllActiveGames() {
        if (confirm('Are you sure you want to end all active games? This action cannot be undone.')) {
            if (this.gameRounds) {
                this.gameRounds.forEach(round => {
                    if (round.status === 'active') {
                        round.status = 'finished';
                        round.endedAt = new Date().toISOString();
                    }
                });
                this.saveGameRounds();
                this.updateAdminOverview();
                this.showModal('Success', 'All active games have been ended.');
            }
        }
    }

    exportGameHistory() {
        const historyData = {
            gameHistory: this.gameHistory,
            gameRounds: this.gameRounds ? this.gameRounds.filter(round => round.status === 'finished') : [],
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(historyData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'game-history-export.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    exportGameStats() {
        const statsData = {
            totalGames: this.gameRounds ? this.gameRounds.length : 0,
            activeGames: this.gameRounds ? this.gameRounds.filter(round => round.status === 'active').length : 0,
            draftGames: this.gameRounds ? this.gameRounds.filter(round => round.status === 'draft').length : 0,
            finishedGames: this.gameRounds ? this.gameRounds.filter(round => round.status === 'finished').length : 0,
            totalPlayers: Object.keys(this.players).length,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(statsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'game-stats-export.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    exportDrafts() {
        const draftsData = {
            drafts: this.gameRounds ? this.gameRounds.filter(round => round.status === 'draft') : [],
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(draftsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'game-drafts-export.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    // Additional missing methods
    updateGameHistory() {
        console.log('Updating game history...');
        // This method will be implemented later
    }

    updatePlayerStats() {
        console.log('Updating player stats...');
        // This method will be implemented later
    }
}

// Initialize the game when the page loads
let gameManager;
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, creating GameManager...');
        gameManager = new GameManager();
        console.log('GameManager created successfully');
    } catch (error) {
        console.error('Error creating GameManager:', error);
    }
});
