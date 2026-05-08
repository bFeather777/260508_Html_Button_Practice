window.onload = function() {
    const timeButton = document.getElementById('timeBtn');
    const timeDisplay = document.getElementById('displayTime');
    const connectBtn = document.getElementById('connectBtn');

    // 1. 時間顯示
    timeButton.addEventListener('click', function() {
        const now = new Date();
        timeDisplay.textContent = `現在時間是：${now.toLocaleTimeString()}`;
    });

    // 2. 藍牙連線邏輯 (Web Bluetooth 版本)
    async function connectToPico() {
    console.log("嘗試發起藍牙連線...");
            try {
                const device = await navigator.bluetooth.requestDevice({
                    filters: [{ namePrefix: 'Pico' }],
                    optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
                });

                const server = await device.gatt.connect();
                const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');

                // --- 關鍵修改：先印出清單，不直接抓取 ---
                console.log("正在掃描此 Service 下所有可用的 UUID...");
                const characteristics = await service.getCharacteristics();
                
                if (characteristics.length === 0) {
                    console.log("警告：這層樓一個櫃檯（Characteristic）都沒有！");
                }

                characteristics.forEach(c => {
                    console.log(">>> 發現可用 UUID:", c.uuid); // 這行會告訴我們真正的號碼
                });

                // 隨便抓清單中的第一個來測試（如果有的話）
                if (characteristics.length > 0) {
                    const firstChar = characteristics[0];
                    console.log("嘗試對第一個發現的 UUID 寫入:", firstChar.uuid);
                    await firstChar.writeValue(new TextEncoder().encode("on\n"));
                    alert("對 " + firstChar.uuid + " 發送成功！");
                }

            } catch (error) {
                console.error("連線失敗：", error);
            }
        }

    // 綁定連線按鈕
    connectBtn.addEventListener('click', connectToPico);
};