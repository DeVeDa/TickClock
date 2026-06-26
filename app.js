document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. CLOCK LOGIC --- */
    const hoursEl = document.getElementById('main-clock-hours');
    const minutesEl = document.getElementById('main-clock-minutes');
    const secondsEl = document.getElementById('main-clock-seconds');
    const ampmEl = document.getElementById('main-clock-ampm');
    const dateEl = document.getElementById('main-clock-date');

    const toggle24h = document.getElementById('toggle-24h');
    let is24Hour = localStorage.getItem('is24Hour') === 'true';

    // Set initial state
    if (toggle24h) toggle24h.checked = is24Hour;

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        if (!is24Hour) {
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
        }

        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;

        if (ampmEl) {
            ampmEl.textContent = ampm;
            // Hide AM/PM in 24h mode
            ampmEl.parentElement.classList.toggle('hidden', is24Hour);
        }

        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    setInterval(updateClock, 1000);
    updateClock(); // initial call


    /* --- 2. NAVIGATION LOGIC --- */
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');

    function switchScreen(targetId) {
        // Toggle body classes for landscape responsive hiding
        if (targetId === 'screen-clock') {
            document.body.classList.add('on-screen-clock');
        } else {
            document.body.classList.remove('on-screen-clock');
        }

        // Hide all screens
        screens.forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show target screen
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            // reset animation
            targetScreen.style.animation = 'none';
            targetScreen.offsetHeight; /* trigger reflow */
            targetScreen.style.animation = null;
        }

        // Update Nav UI
        navItems.forEach(item => {
            item.classList.remove('active', 'text-on-secondary-container');
            item.classList.add('text-on-surface-variant');

            const iconWrapper = item.querySelector('.nav-icon-wrapper');
            iconWrapper.classList.remove('bg-secondary-container', 'text-on-secondary-container');

            const icon = iconWrapper.querySelector('span');
            icon.style.fontVariationSettings = "'FILL' 0";

            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
                item.classList.remove('text-on-surface-variant');
                iconWrapper.classList.add('bg-secondary-container', 'text-on-secondary-container');
                icon.style.fontVariationSettings = "'FILL' 1";
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            switchScreen(target);
        });
    });

    // Header buttons
    const settingsBtn = document.querySelector('.nav-btn-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => switchScreen('screen-settings'));
    }

    document.querySelectorAll('.nav-btn-back').forEach(btn => {
        btn.addEventListener('click', () => switchScreen('screen-clock'));
    });

    const landscapeTimer = document.getElementById('landscape-sleep-timer');
    if (landscapeTimer) {
        landscapeTimer.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the tap-to-show logic
            switchScreen('screen-timer');
        });
    }

    const landscapeSettingsBtn = document.getElementById('landscape-settings-btn');
    if (landscapeSettingsBtn) {
        landscapeSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the tap-to-show logic
            switchScreen('screen-settings');
        });
    }

    // Tap-to-show logic for landscape mode
    let hideControlsTimeout = null;
    const screenClock = document.getElementById('screen-clock');
    if (screenClock) {
        screenClock.addEventListener('click', () => {
            // Only relevant in landscape
            if (window.innerWidth > window.innerHeight) {
                document.body.classList.add('show-landscape-controls');

                if (hideControlsTimeout) clearTimeout(hideControlsTimeout);

                hideControlsTimeout = setTimeout(() => {
                    document.body.classList.remove('show-landscape-controls');
                }, 3000); // 3 seconds
            }
        });
    }


    /* --- 3. THEME LOGIC --- */
    const htmlEl = document.documentElement;
    const themeCards = document.querySelectorAll('.theme-card');
    const switchThemeBtn = document.querySelector('.btn-switch-theme');

    const themes = ['theme-organic', 'theme-neon', 'theme-solar', 'theme-amoled'];
    let currentThemeIndex = 0;

    function setTheme(themeClass) {
        // Remove old themes
        themes.forEach(t => htmlEl.classList.remove(t));
        // Add new
        htmlEl.classList.add(themeClass);
        htmlEl.classList.remove('dark');
        currentThemeIndex = themes.indexOf(themeClass);

        // Update Settings UI
        themeCards.forEach(card => {
            card.classList.remove('active', 'border-primary');
            card.classList.add('border-transparent');
            const check = card.querySelector('.check-icon');
            if (check) check.classList.add('hidden');

            if (card.getAttribute('data-theme') === themeClass) {
                card.classList.add('active', 'border-primary');
                card.classList.remove('border-transparent');
                if (check) check.classList.remove('hidden');
            }
        });
    }

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            setTheme(card.getAttribute('data-theme'));
        });
    });

    if (switchThemeBtn) {
        switchThemeBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            setTheme(themes[currentThemeIndex]);
        });
    }

    if (toggle24h) {
        toggle24h.addEventListener('change', (e) => {
            is24Hour = e.target.checked;
            localStorage.setItem('is24Hour', is24Hour);
            updateClock();
        });
    }

    /* --- 4. TOGGLES & TOASTS --- */
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-lg flex items-center justify-between font-label text-sm font-bold z-50';
        toast.textContent = message;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 1000);
    }

    const musicToggle = document.getElementById('toggle-music');
    musicToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            showToast("Music will turn off when timer ends");
        } else {
            showToast("Music will stay on");
        }
    });

    const btToggle = document.getElementById('toggle-bluetooth');
    btToggle.addEventListener('change', async (e) => {
        if (e.target.checked) {
            showToast("Bluetooth will turn off when timer ends");

            // Proactively request modern Android Bluetooth runtime permissions if on device
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                try {
                    const plugin = window.Capacitor.Plugins.SleepTimerPlugin;
                    if (plugin && plugin.checkPermissions && plugin.requestPermissions) {
                        const status = await plugin.checkPermissions();
                        if (status.bluetooth !== 'granted') {
                            await plugin.requestPermissions();
                        }
                    }
                } catch (err) {
                    console.error("Bluetooth Permission Request Error:", err);
                }
            }
        } else {
            showToast("Bluetooth will stay on");
        }
    });

    /* --- 5. TIMER PICKER LOGIC --- */
    let timerHours = 0;
    let timerMinutes = 15;

    const lblPickerHours = document.getElementById('picker-hours');
    const lblPickerMinutes = document.getElementById('picker-minutes');
    const displayHoursBlock = document.getElementById('display-hours-block');
    const displayMinutes = document.getElementById('display-minutes');
    const displaySeconds = document.getElementById('display-seconds');
    const timerEndTimeEl = document.getElementById('timer-end-time');

    let countdownInterval = null;
    let remainingSeconds = 0;
    let isTimerRunning = false;
    let initialTotalSeconds = 0; // NEW GLOBAL

    const progressRing = document.getElementById('timer-progress-ring');
    const ringCircumference = 289.026;

    function updateTimerUI() {
        const hh = timerHours.toString().padStart(2, '0');
        const mm = timerMinutes.toString().padStart(2, '0');

        lblPickerHours.textContent = hh;
        lblPickerMinutes.textContent = mm;

        if (!isTimerRunning) {
            displayHoursBlock.textContent = `${timerHours} ${timerHours === 1 ? 'HOUR' : 'HOURS'}`;
            displayMinutes.textContent = mm;
            displaySeconds.textContent = "00";
        }

        // --- Visual Beat & Halo Binding ---
        const timerGlow = document.getElementById('timer-glow');
        const timerHalo = document.getElementById('timer-halo');

        if (timerGlow) {
            if (isTimerRunning) {
                timerGlow.classList.add('opacity-100', 'theme-glow');
                timerGlow.classList.remove('opacity-0');
            } else {
                timerGlow.classList.remove('opacity-100', 'theme-glow');
                timerGlow.classList.add('opacity-0');
            }
        }

    }

    document.getElementById('btn-inc-hour').addEventListener('click', () => { timerHours = (timerHours + 1) % 24; updateTimerUI(); });
    document.getElementById('btn-dec-hour').addEventListener('click', () => { timerHours = (timerHours - 1 + 24) % 24; updateTimerUI(); });

    document.getElementById('btn-inc-min').addEventListener('click', () => {
        timerMinutes += 5;
        if (timerMinutes >= 60) {
            timerMinutes = 0;
            timerHours = (timerHours + 1) % 24;
        }
        updateTimerUI();
    });

    document.getElementById('btn-dec-min').addEventListener('click', () => {
        timerMinutes -= 1;
        if (timerMinutes < 0) {
            timerMinutes = 55;
            timerHours = (timerHours - 1 + 24) % 24;
        }
        updateTimerUI();
    });

    updateTimerUI();

    const startTimerBtn = document.getElementById('btn-start-timer');
    startTimerBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            clearInterval(countdownInterval);
            isTimerRunning = false;
            document.body.classList.remove('timer-running');
            //showToast("Sleep timer cancelled.");
            startTimerBtn.innerHTML = `<span class="material-symbols-outlined text-xl" data-icon="play_arrow" style="font-variation-settings: 'FILL' 1;">play_arrow</span> Start Sleep Timer`;
            updateTimerUI();
            return;
        }

        if (timerHours === 0 && timerMinutes === 0) {
            showToast("Please select a valid timer duration.");
            return;
        }

        remainingSeconds = timerHours * 3600 + timerMinutes * 60;
        initialTotalSeconds = remainingSeconds; // Set for ratio tracking
        isTimerRunning = true;
        document.body.classList.add('timer-running');

        startTimerBtn.innerHTML = `<span class="material-symbols-outlined text-xl" data-icon="stop" style="font-variation-settings: 'FILL' 1;">stop</span> Cancel Timer`;

        let msg = `Sleep Timer is set for `;
        if (timerHours > 0) msg += `${timerHours} hour${timerHours > 1 ? 's' : ''} `;
        if (timerHours > 0 && timerMinutes > 0) msg += `and `;
        if (timerMinutes > 0 || timerHours === 0) msg += `${timerMinutes} minute${timerMinutes > 1 ? 's' : ''}.`;
        showToast(msg);

        updateTimerEndTime();

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                isTimerRunning = false;
                document.body.classList.remove('timer-running');
                showToast("Sleep timer ended!");
                startTimerBtn.innerHTML = `<span class="material-symbols-outlined text-xl" data-icon="play_arrow" style="font-variation-settings: 'FILL' 1;">play_arrow</span> Start Sleep Timer`;
                updateTimerUI();

                // Trigger Native System actions if running via Capacitor app wrapper
                const turnOffMusic = musicToggle.checked;
                const turnOffBluetooth = btToggle.checked;

                if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                    try {
                        const SleepTimerPlugin = window.Capacitor.Plugins.SleepTimerPlugin;
                        if (!SleepTimerPlugin) {
                            alert("Native Java Plugin not found! Please ensure Android project is fully re-compiled.");
                            return;
                        }
                        SleepTimerPlugin.performSleepActions({
                            turnOffMusic: turnOffMusic,
                            turnOffBluetooth: turnOffBluetooth
                        }).catch(err => alert("Native plugin execution failed: " + JSON.stringify(err)));
                    } catch (e) {
                        alert("Invocation error: " + e.message);
                    }
                } else {
                    console.log("Mock Sleep Actions: Music=" + turnOffMusic + ", BT=" + turnOffBluetooth);
                }
            } else {
                updateCountdownDisplay();
            }
        }, 1000);
        updateCountdownDisplay();
    });

    function updateTimerEndTime() {
        const now = new Date();
        now.setHours(now.getHours() + timerHours);
        now.setMinutes(now.getMinutes() + timerMinutes);
        let endH = now.getHours();
        const endM = now.getMinutes().toString().padStart(2, '0');
        const endAmpm = endH >= 12 ? 'PM' : 'AM';
        endH = endH % 12;
        endH = endH ? endH : 12;
        timerEndTimeEl.textContent = `${endH}:${endM} ${endAmpm}`;
    }


    function updateCountdownDisplay() {
        const h = Math.floor(remainingSeconds / 3600);
        const m = Math.floor((remainingSeconds % 3600) / 60);
        const s = remainingSeconds % 60;

        const hStr = h.toString();
        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');

        displayHoursBlock.textContent = `${h} ${h === 1 ? 'HOUR' : 'HOURS'}`;
        displayMinutes.textContent = mStr;
        displaySeconds.textContent = sStr;

        const landscapeText = document.getElementById('landscape-timer-text');
        if (landscapeText) {
            landscapeText.textContent = h > 0 ? `${hStr}:${mStr}:${sStr}` : `${mStr}:${sStr}`;
        }

        // --- Visual Ring Binding ---
        if (progressRing) {
            if (isTimerRunning && initialTotalSeconds > 0) {
                const ratio = remainingSeconds / initialTotalSeconds;
                const offset = ringCircumference - (ratio * ringCircumference);
                progressRing.style.strokeDashoffset = offset;
            } else {
                // Return to pure full ring when editing preview
                progressRing.style.strokeDashoffset = 0;
            }
        }

        // --- Visual Beat & Halo Binding ---
        const timerGlow = document.getElementById('timer-glow');
        const timerHalo = document.getElementById('timer-halo');

        if (timerGlow) {
            if (isTimerRunning) {
                timerGlow.classList.add('opacity-100', 'theme-glow');
                timerGlow.classList.remove('opacity-0');
            } else {
                timerGlow.classList.remove('opacity-100', 'theme-glow');
                timerGlow.classList.add('opacity-0');
            }
        }
    }

    // Init
    switchScreen('screen-clock');

});
