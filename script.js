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
    console.log("1. 嘗試發起藍牙連線...");
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'Pico' }],
            optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']
        });

        console.log("2. 裝置已選取，正在連線 GATT...");
        const server = await device.gatt.connect();

        console.log("3. 正在取得 Service...");
        const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');

        // --- 核心偵錯區：先看這層樓到底有誰 ---
        console.log("4. 正在掃描該服務下的所有可用特徵值...");
        const characteristics = await service.getCharacteristics();
        
        console.log(`>>> 掃描完成！共發現 ${characteristics.length} 個特徵值：`);
        characteristics.forEach(c => {
            console.log("找到特徵值 UUID:", c.uuid); 
        });
        // ------------------------------------

        // 5. 嘗試從發現的清單中找出一個來寫入
        if (characteristics.length > 0) {
            // 我們直接抓清單中的第一個，或者找跟 6e400002 最像的那個
            const targetChar = characteristics.find(c => c.uuid.includes('0002')) || characteristics[0];
            
            console.log(`6. 準備對 ${targetChar.uuid} 寫入指令...`);
            await targetChar.writeValue(new TextEncoder().encode("on\n"));
            alert("成功！已對 " + targetChar.uuid + " 發送指令。");
        } else {
            throw new Error("這層樓竟然一個特徵值都沒有！");
        }

    } catch (error) {
        console.log("!!! 報錯位置發生在步驟之後 !!!");
        console.error("詳細錯誤訊息：", error);
        alert("連線失敗，請看 Console 裡的清單");
    }
}}