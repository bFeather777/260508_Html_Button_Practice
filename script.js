window.onload = function() {
    const timeButton = document.getElementById('timeBtn');
    const timeDisplay = document.getElementById('displayTime');
    const connectBtn = document.getElementById('connectBtn'); // 假設你在 HTML 多加了一個連線按鈕

    //timeButton點擊
    timeButton.addEventListener('click', function() {
        const now = new Date();
        timeDisplay.textContent = `現在時間是：${now.toLocaleTimeString()}`;
    });

    //非同步的事件
    async function connectToPico() {
        try {
                console.log("正在請求藍牙裝置...");
                
                // 1. 請求裝置（這會彈出瀏覽器配對視窗）
                const device = await navigator.bluetooth.requestDevice({
                    filters: [{ namePrefix: 'Pico-D' }], // 這裡對應你原本的 "Pico-D"
                    optionalServices: ['6E400001-B5A3-F393-E0A9-E50E24DCCA9E'] // 舉例：這是常見的 Nordic UART UUID
                });

                // 2. 連線到 GATT 伺服器
                const server = await device.gatt.connect();
                console.log("已連線到 GATT Server");

                // 3. 取得服務 (Service)
                const service = await server.getPrimaryService('6E400001-B5A3-F393-E0A9-E50E24DCCA9E');

                // 4. 取得寫入特徵值 (Characteristic)
                // 這裡要根據你 Pico 程式定義的 UUID 來填寫
                const characteristic = await service.getCharacteristic('6E400001-B5A3-F393-E0A9-E50E24DCCA9E');

                // 5. 寫入數據 (對應你原本的 "on\n")
                const encoder = new TextEncoder();
                await characteristic.writeValue(encoder.encode("on\n"));

                console.log("數據 'on\\n' 已成功發送到 Pico-D！");
                alert("控制指令已送出！");

            } catch (error) {
                console.error("藍牙操作失敗：", error);
                alert("錯誤: " + error.message);
            }
    }

    connectBtn.addEventListener('click', connectToPico);
};