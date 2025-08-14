# 🎭 2 Truths & 1 Lie - Test IOs Game

A multiplayer web-based game where players take turns sharing two true statements and one lie. Other players must guess which statement is the lie!

## 🚀 How to Play

### Game Setup
1. **Create a Game**: Enter your name and click "Create Game" to start a new game
2. **Get Game Code**: You'll receive a unique 6-character game code
3. **Share Code**: Share this code with other players so they can join
4. **Start Game**: Once players have joined, the host can start the game

### Joining a Game
1. **Enter Details**: Input your name and the game code provided by the host
2. **Click Join**: Click "Join Game" to enter the game room
3. **Wait for Start**: Wait for the host to start the game

### Gameplay
1. **Take Turns**: Players take turns one by one
2. **Submit Statements**: When it's your turn, enter:
   - 2 true statements about yourself
   - 1 false statement (lie)
3. **Vote**: All players vote on which statement they think is the lie
4. **Score Points**: 
   - 10 points for correctly identifying the lie
   - Bonus points for the statement giver (more points if fewer people guess correctly)

### Game Flow
- **Waiting**: Players join and wait for the host to start
- **Active**: Players take turns submitting statements
- **Voting**: All players vote on the current player's statements
- **Results**: Points are calculated and displayed
- **Next Round**: Process repeats until all players have had their turn
- **Finished**: Final scores are displayed and winner is announced

## 🎯 Features

- **Multiplayer Support**: Up to 8 players per game
- **Real-time Updates**: Live game state updates
- **Persistent Data**: Game history and player statistics saved locally
- **Responsive Design**: Works on desktop and mobile devices
- **No External Dependencies**: Pure HTML, CSS, and JavaScript
- **Local Storage**: Data persists between browser sessions

## 🏆 Scoring System

- **Correct Guess**: 10 points
- **Statement Giver Bonus**: 10 - (2 × correct guesses) points
  - More points if your lie is harder to spot!
- **Final Winner**: Player with the highest total score

## 🛠️ Technical Details

### Data Storage
- **LocalStorage**: All game data is stored locally in the browser
- **No Server Required**: Completely client-side application
- **Data Persistence**: Games, players, and history are saved between sessions

### Browser Compatibility
- Modern browsers with LocalStorage support
- Responsive design for mobile and desktop
- No external libraries or frameworks required

### Game States
- `waiting`: Players joining, host can start
- `active`: Players submitting statements
- `voting`: Players voting on statements
- `finished`: Game completed, results displayed

## 🚀 Getting Started

1. **Access the Game**: Navigate to `/truth-lie-game/` in your browser
2. **Create or Join**: Start a new game or join an existing one
3. **Play**: Follow the on-screen instructions to play
4. **Enjoy**: Have fun with friends and family!

## 📱 Mobile Support

The game is fully responsive and works great on mobile devices:
- Touch-friendly interface
- Optimized layouts for small screens
- Easy navigation between game sections

## 🔧 Customization

The game can be easily customized by modifying:
- `styles.css`: Visual appearance and layout
- `script.js`: Game logic and mechanics
- `index.html`: Game structure and content

## 🎮 Game Tips

- **Be Creative**: Make your statements interesting and believable
- **Mix It Up**: Vary the difficulty of your statements
- **Pay Attention**: Watch for patterns in other players' statements
- **Have Fun**: The goal is entertainment and getting to know each other!

---

**Note**: This is a local multiplayer game. All players must be on the same device or share the same browser session to play together. For true online multiplayer, a server-side implementation would be required.
