class KuromiTimer {
    constructor() {
        // Timer properties
        this.timer = null;
        this.clockTimer = null;
        this.isRunning = false;
        this.isPaused = false;
        this.totalSeconds = 0;
        this.originalSeconds = 0;
        
        // Settings
        this.soundEnabled = true;
        this.darkMode = false;
        
        // Stats
        this.stats = this.loadStats();
        
        // Audio context
        this.audioContext = null;
        
        // Initialize everything
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeAudio();
        this.loadSettings();
        this.updateDisplay();
        this.updateStats();
        this.showMotivationalMessage();
        this.startClock(); // Start the real-time clock
        
        // Messages
        this.motivationalMessages = [
            "🌟 You've got this! Kuromi believes in you! 💜",
            "💪 Stay focused! Every second counts! ⏰",
            "🎯 You're doing amazing! Keep going! ✨",
            "🔥 Focus mode activated! You're unstoppable! 💥",
            "🌸 Breathe deep and concentrate! 🧘‍♀️",
            "⭐ Your future self will thank you! 🙏",
            "🎀 Kuromi's cheering you on! がんばって！ 💕",
            "🌙 Success is built one focused session at a time! 🏗️"
        ];
        
        this.statusMessages = {
            ready: "Ready to focus! 💜",
            running: "Stay focused! You're doing great! ⏰",
            paused: "Take a breath, resume when ready! 😌",
            completed: "Session complete! Well done! 🎉",
            urgent: "Final countdown! Push through! 🔥"
        };
        
        console.log("Kuromi Timer initialized successfully!");
    }
    
    initializeElements() {
        // Timer elements
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.countdown = document.getElementById('countdown');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.timerContainer = document.querySelector('.timer-container');
        this.timerStatus = document.getElementById('timerStatus');
        this.progressCircle = document.getElementById('progressCircle');
        
        // Clock elements
        this.currentTime = document.getElementById('currentTime');
        this.hourHand = document.getElementById('hourHand');
        this.minuteHand = document.getElementById('minuteHand');
        this.secondHand = document.getElementById('secondHand');
        
        // Settings elements
        this.settingsPanel = document.getElementById('settingsPanel');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSettings = document.getElementById('closeSettings');
        this.soundToggle = document.getElementById('soundToggle');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        
        // Stats elements
        this.totalTime = document.getElementById('totalTime');
        this.completedSessions = document.getElementById('completedSessions');
        this.currentStreak = document.getElementById('currentStreak');
        this.motivationalMessage = document.getElementById('motivationalMessage');
    }
    
    initializeEventListeners() {
        // Timer controls
        this.startBtn.addEventListener('click', () => {
            console.log("Start button clicked");
            this.startTimer();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            console.log("Pause button clicked");
            this.pauseTimer();
        });
        
        this.stopBtn.addEventListener('click', () => {
            console.log("Stop button clicked");
            this.stopTimer();
        });
        
        // Input changes
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
            input.addEventListener('input', () => {
                if (!this.isRunning) {
                    this.updateDisplay();
                }
            });
        });
        
        // Settings
        this.settingsBtn.addEventListener('click', () => {
            console.log("Settings button clicked");
            this.openSettings();
        });
        
        this.closeSettings.addEventListener('click', () => {
            console.log("Close settings clicked");
            this.closeSettingsPanel();
        });
        
        this.soundToggle.addEventListener('change', () => {
            console.log("Sound toggle changed:", this.soundToggle.checked);
            this.toggleSound();
        });
        
        this.darkModeToggle.addEventListener('change', () => {
            console.log("Dark mode toggle changed:", this.darkModeToggle.checked);
            this.toggleDarkMode();
        });
        
        this.fullscreenBtn.addEventListener('click', () => {
            console.log("Fullscreen button clicked");
            this.toggleFullscreen();
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const time = parseInt(btn.dataset.time);
                console.log("Preset button clicked:", time);
                this.setPreset(time);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Initialize audio on first interaction
        document.addEventListener('click', () => this.initializeAudioContext(), { once: true });
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && !this.settingsBtn.contains(e.target)) {
                if (this.settingsPanel.classList.contains('open')) {
                    this.closeSettingsPanel();
                }
            }
        });
    }
    
    initializeAudio() {
        // Audio will be created using Web Audio API
        console.log("Audio initialized");
    }
    
    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            console.log("Audio context initialized");
        } catch (e) {
            console.log('Web Audio API not supported:', e);
        }
    }
    
    // Real-time Clock Functions
    startClock() {
        this.updateClock();
        this.clockTimer = setInterval(() => {
            this.updateClock();
        }, 1000);
    }
    
    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Update digital time display
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.currentTime.textContent = timeString;
        
        // Update analog clock hands
        const hourDegrees = ((hours % 12) * 30) + (minutes * 0.5);
        const minuteDegrees = minutes * 6;
        const secondDegrees = seconds * 6;
        
        this.hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        this.minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        this.secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    }
    
    // Audio Functions
    playTickSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        } catch (e) {
            console.log("Error playing tick sound:", e);
        }
    }
    
    playCompleteSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            const noteTime = 0.4;
            
            notes.forEach((frequency, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + noteTime);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + noteTime);
                }, index * 150);
            });
        } catch (e) {
            console.log("Error playing complete sound:", e);
        }
    }
    
    playUrgentSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        } catch (e) {
            console.log("Error playing urgent sound:", e);
        }
    }
    
    // Timer Functions
    startTimer() {
        if (!this.isRunning && !this.isPaused) {
            const hours = parseInt(this.hoursInput.value) || 0;
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
            this.originalSeconds = this.totalSeconds;
        }
        
        if (this.totalSeconds <= 0) {
            this.showNotification('⏰ Please set a time greater than 0!', 'error');
            return;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.startBtn.style.display = 'none';
        this.pauseBtn.style.display = 'inline-flex';
        this.timerContainer.classList.add('timer-active');
        this.timerStatus.textContent = this.statusMessages.running;
        
        this.disableInputs(true);
        
        this.timer = setInterval(() => {
            this.totalSeconds--;
            this.updateDisplay();
            this.updateProgressRing();
            this.playTickSound();
            
            if (this.totalSeconds <= 10 && this.totalSeconds > 0) {
                this.timerContainer.classList.add('timer-urgent');
                this.playUrgentSound();
            }
            
            if (this.totalSeconds <= 0) {
                this.timerComplete();
            }
        }, 1000);
        
        this.showMotivationalMessage();
    }
    
    pauseTimer() {
        this.isRunning = false;
        this.isPaused = true;
        this.startBtn.style.display = 'inline-flex';
        this.pauseBtn.style.display = 'none';
        this.timerContainer.classList.remove('timer-active', 'timer-urgent');
        this.timerStatus.textContent = this.statusMessages.paused;
        
        clearInterval(this.timer);
    }
    
    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.totalSeconds = 0;
        this.startBtn.style.display = 'inline-flex';
        this.pauseBtn.style.display = 'none';
        this.timerContainer.classList.remove('timer-active', 'timer-urgent', 'timer-complete');
        this.timerStatus.textContent = this.statusMessages.ready;
        
        this.disableInputs(false);
        
        clearInterval(this.timer);
        this.updateDisplay();
        this.updateProgressRing();
        this.showMotivationalMessage();
    }
    
    timerComplete() {
        this.isRunning = false;
        this.isPaused = false;
        this.totalSeconds = 0;
        this.startBtn.style.display = 'inline-flex';
        this.pauseBtn.style.display = 'none';
        this.timerContainer.classList.remove('timer-active', 'timer-urgent');
        this.timerContainer.classList.add('timer-complete');
        this.timerStatus.textContent = this.statusMessages.completed;
        
        this.disableInputs(false);
        clearInterval(this.timer);
        
        // Update stats
        this.stats.completedSessions++;
        this.stats.currentStreak++;
        this.stats.totalStudyTime += this.originalSeconds;
        this.stats.lastSessionDate = new Date().toDateString();
        this.saveStats();
        this.updateStats();
        
        this.playCompleteSound();
        this.showNotification('🎉 Session Complete! Great job studying! 💜', 'success');
        
        setTimeout(() => {
            this.timerContainer.classList.remove('timer-complete');
            this.updateDisplay();
            this.updateProgressRing();
            this.showMotivationalMessage();
        }, 3000);
    }
    
    // Display Functions
    updateDisplay() {
        let displaySeconds;
        
        if ((this.isRunning || this.isPaused) && this.totalSeconds >= 0) {
            displaySeconds = this.totalSeconds;
        } else {
            const hours = parseInt(this.hoursInput.value) || 0;
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            displaySeconds = hours * 3600 + minutes * 60 + seconds;
        }
        
        const hours = Math.floor(displaySeconds / 3600);
        const minutes = Math.floor((displaySeconds % 3600) / 60);
        const secs = displaySeconds % 60;
        
        if (hours > 0) {
            this.countdown.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            this.countdown.textContent = 
                `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    updateProgressRing() {
        if (this.originalSeconds > 0) {
            const progress = (this.originalSeconds - this.totalSeconds) / this.originalSeconds;
            const circumference = 2 * Math.PI * 140;
            const offset = circumference - (progress * circumference);
            this.progressCircle.style.strokeDashoffset = offset;
        } else {
            this.progressCircle.style.strokeDashoffset = 880;
        }
    }
    
    updateStats() {
        this.totalTime.textContent = this.formatTime(this.stats.totalStudyTime);
        this.completedSessions.textContent = this.stats.completedSessions;
        this.currentStreak.textContent = this.stats.currentStreak;
        
        const lastSession = new Date(this.stats.lastSessionDate || '1970-01-01');
        const today = new Date();
        const daysDifference = Math.floor((today - lastSession) / (1000 * 60 * 60 * 24));
        
        if (daysDifference > 2) {
            this.stats.currentStreak = 0;
            this.currentStreak.textContent = '0';
        }
    }
    
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    disableInputs(disabled) {
        this.hoursInput.disabled = disabled;
        this.minutesInput.disabled = disabled;
        this.secondsInput.disabled = disabled;
    }
    
    // Settings Functions
    openSettings() {
        this.settingsPanel.classList.add('open');
    }
    
    closeSettingsPanel() {
        this.settingsPanel.classList.remove('open');
    }
    
    toggleSound() {
        this.soundEnabled = this.soundToggle.checked;
        this.saveSettings();
        console.log("Sound enabled:", this.soundEnabled);
    }
    
    toggleDarkMode() {
        this.darkMode = this.darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', this.darkMode);
        this.saveSettings();
        console.log("Dark mode enabled:", this.darkMode);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen().catch(console.error);
        }
    }
    
    setPreset(seconds) {
        if (this.isRunning) return;
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        this.hoursInput.value = hours;
        this.minutesInput.value = minutes;
        this.secondsInput.value = remainingSeconds;
        
        this.updateDisplay();
        this.closeSettingsPanel();
    }
    
    // Utility Functions
    showMotivationalMessage() {
        const randomMessage = this.motivationalMessages[
            Math.floor(Math.random() * this.motivationalMessages.length)
        ];
        this.motivationalMessage.textContent = randomMessage;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            font-weight: bold;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Add slide-out animation
        style.textContent += `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    }
    
    handleKeyboardShortcuts(e) {
        if (e.code === 'Space' && !e.target.matches('input')) {
            e.preventDefault();
            if (this.isRunning) {
                this.pauseTimer();
            } else {
                this.startTimer();
            }
        }
        
        if (e.code === 'Escape') {
            this.stopTimer();
        }
        
        if (e.code === 'KeyS' && e.ctrlKey) {
            e.preventDefault();
            this.openSettings();
        }
    }
    
    // Data Persistence (Note: using variables instead of localStorage for artifact compatibility)
    loadStats() {
        // In a real implementation, this would use localStorage
        return {
            totalStudyTime: 0,
            completedSessions: 0,
            currentStreak: 0,
            lastSessionDate: null
        };
    }
    
    saveStats() {
        // In a real implementation, this would save to localStorage
        console.log("Stats saved:", this.stats);
    }
    
    loadSettings() {
        // In a real implementation, this would load from localStorage
        this.soundToggle.checked = this.soundEnabled;
        this.darkModeToggle.checked = this.darkMode;
        
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
    
    saveSettings() {
        // In a real implementation, this would save to localStorage
        console.log("Settings saved - Sound:", this.soundEnabled, "Dark mode:", this.darkMode);
    }
}

// Initialize timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing Kuromi Timer...");
    window.kuromiTimer = new KuromiTimer();

    // Real-time clock update when timer is not running
    function updateLiveClock() {
        const timer = window.kuromiTimer;
        if (!timer.isRunning && !timer.isPaused) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            timer.countdown.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    setInterval(updateLiveClock, 1000);

    // Add a loading completion class for any additional styling
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});