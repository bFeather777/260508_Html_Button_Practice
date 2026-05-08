window.onload = function() {
    const timeButton = document.getElementById('timeBtn');
    const timeDisplay = document.getElementById('displayTime');
    const connectBtn = document.getElementById('connectBtn');

    // 1. 時間顯示邏輯
    timeButton.addEventListener('click', function() {
        const now = new Date();
        timeDisplay.textContent = `現在時間是：${now.toLocaleTimeString()}`;
    });

    // 2. 藍牙連線邏輯 (Web Bluetooth 版本)
    async function connectToPico() {
        console.log("嘗試發起藍牙連線...");
        
        try {
            // 請求裝置 (這會彈出視窗)
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ name: 'Pico-D' }], // 這裡的名字要跟 Pico 廣播名稱完全一致
                optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] // Service UUID
            });

            console.log("裝置已選取，正在連線...");
            const server = await device.gatt.connect();

            // 取得 UART 服務
            const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');

            // 取得負責「接收指令」的特徵值 (RX)
            const characteristic = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');

            // 傳送 "on\n" 指令
            const encoder = new TextEncoder();
            await characteristic.writeValue(encoder.encode("on\n"));

            console.log("發送成功：on");
            alert("已成功對 Pico 發送 ON 指令！");

        } catch (error) {
            // 這裡會捕捉到所有錯誤，並印在 Console
            console.error("連線失敗：", error);
            alert("連線失敗，請檢查 Console");
        }
    }

    // 綁定連線按鈕
    connectBtn.addEventListener('click', connectToPico);
};