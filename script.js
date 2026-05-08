window.onload = function() {  //這個函數會在視窗完全畫完之後才會使用
    const timeButton = document.getElementById('timeBtn');
    const timeDisplay = document.getElementById('displayTime');
    const connectBtn = document.getElementById('connectBtn');
    const unconnectBtn = document.getElementById('unconnectBtn');

    // 1. 時間顯示邏輯，點下timeButton後，會執行引號中的這一串東西
    timeButton.addEventListener('click', function() {
        const now = new Date();
        console.log("顯示目前時間...");
        timeDisplay.textContent = `現在時間是：${now.toLocaleTimeString()}`;
    });

    // 2. 藍牙連線邏輯
    async function connectToPico() {
        console.log("1. 嘗試發起藍牙連線...");
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'Pico' }],
                optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']  //UUID
            });

            console.log("2. 裝置已選取，正在連線 GATT...");
            const server = await device.gatt.connect();

            console.log("3. 正在取得 Service...");
            const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');

            console.log("4. 正在掃描所有特徵值...");
            const characteristics = await service.getCharacteristics();
            
            console.log(`>>> 掃描完成！共發現 ${characteristics.length} 個特徵值：`);
            characteristics.forEach(c => {
                console.log("找到特徵值 UUID:", c.uuid); 
            });

            if (characteristics.length > 0) {
                // 尋找包含 0002 的特徵值，找不到就拿第一個
                const targetChar = characteristics.find(c => c.uuid.includes('0002')) || characteristics[0];
                console.log(`6. 準備對 ${targetChar.uuid} 寫入指令...`);
                await targetChar.writeValue(new TextEncoder().encode("off\n"));
                alert("成功！已對 " + targetChar.uuid + " 發送指令。");
            } else {
                throw new Error("找不到任何特徵值");
            }

        } catch (error) {
            console.error("連線失敗：", error);
            alert("失敗原因：" + error.message);
        }
    }

    // 3. 綁定事件，點下去connectBtn後，會執行connectToPico這個函數
    connectBtn.addEventListener('click', connectToPico);
}; 