# TickClock
# ⏰ TickClock V1

> **A Gorgeous Glassmorphic Clock & Intelligent Native Sleep Timer for Android.**  
> Built with pixel-perfect modern web design, seamless transitions, and a highly reliable Native Android Foreground Service.

---

## 🌟 Overview

**Tick Clock** is not just another clock utility—it is a premium, state-of-the-art bedside companion and sleep timer app. It bridges the aesthetic elegance of **high-end glassmorphism** and dynamic glow effects with the technical robustness of **Android Native Services**. 

Standard JavaScript timers lag or get killed by Android’s aggressive battery saving mechanisms when the screen locks. **Tick Clock** solves this by offloading the timer to a dedicated **Native Foreground Service**, ensuring your sleep actions execute perfectly on time, every single time.

---

## 🎨 Premium Design Aesthetics

The interface is built to wow at first glance, featuring:
* **Glassmorphic Edge Lighting**: Cards glow with a spinning edge-light border and dynamic background accent reflections that adapt to your theme.
* **4 harmonious Curated Themes**:
  * 🌿 **Organic Chronos**: A fresh, comforting Material You theme featuring vibrant, dynamic lavender/purple accents.
  * ⚡ **Neon Nocturne**: A high-contrast cybernetic blue theme built for energy, vibrancy, and a modern digital look.
  * ☀️ **Solar Dust**: Muted warm earth tones reminiscent of desert sands and olive groves.
  * 🖤 **Pitch Black**: A deep, battery-saving AMOLED mode with glowing contrast outlines.
* **Adaptive Typography**: Styled using custom Google Fonts—*Plus Jakarta Sans* for headlines, *Space Grotesk* for clock numerals, and *Manrope* for interface labels.
* **Bedside Landscape Mode**: Automatically detects landscape orientation to maximize readability and optionally keep the screen awake while docked.

---

## ⚡ Core Features

1. **Intelligent Sleep Timer**: Easily configure counts in Hours & Minutes.
2. **Automated End-of-Timer Actions**:
   * 🎵 **Turn Off Music**: Stops all active media/audio playback across the OS.
   * 📡 **Turn Off Bluetooth**: Disconnects wireless headphones or speakers to save battery.
3. **Rock-Solid Background Reliability**: Relies on a persistent, non-swipeable Android notification bar countdown, powered by a native `ForegroundService` and `CountDownTimer`.
4. **Instant UI Syncing**: If you close the app and reopen it, the frontend instantly communicates with the native layer to sync the visual SVG progress ring and countdown.
5. **Flexible Format**: Easily toggle between standard 12-hour and military 24-hour displays.

---

## 🛠️ Architecture & Tech Stack

* **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS JIT compiler, CSS Custom Properties.
* **Native & Bridge**: 
  * [Capacitor CLI](https://capacitorjs.com/) for building cross-platform native containers.
  * Custom Android plugins bridging JS listeners to Java API classes.
* **Android Native**:
  * `SleepTimerService`: Runs a foreground task, managing a wake lock and persistent notifications.
  * `SleepTimerPlugin`: Passes commands (`startTimer`, `stopTimer`, `setKeepAwake`) and emits real-time ticks back to JS.

---

## 🚀 Setup & Installation
1. Download the TickClock App on your Android device or launch an emulator, and click **Install** (or use the Gradle CLI).
2. A web preview of the Android application is also uploaded to show UI, Interactive features and functionalities are disabled here. To experience the full app, please download and install the APK version.

## 🔒 Permissions Used

* `FOREGROUND_SERVICE`: Runs the timer in a native background thread so it is never suspended by the OS.
* `POST_NOTIFICATIONS`: Shows the unsweepable active ticking status bar notification.
* `WAKE_LOCK`: Keeps the background thread alive and keeps the screen awake in landscape mode when toggled.
* `BLUETOOTH_ADMIN` / `BLUETOOTH_CONNECT`: Disconnects Bluetooth on countdown end.

---

## 📄 License

This project is licensed under the Individual License. Created and maintained by the Vedaraj Shetti ( vs.vedarajshetti@gmail.com/ vs.vedaraj1000@gmail.com) team.
