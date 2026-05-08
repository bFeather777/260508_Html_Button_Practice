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
        const noble = require('@abandonware/noble');

        // 1. 啟動藍牙掃描 
        noble.on('stateChange', (state) => {
            if (state === 'poweredOn') {
                noble.startScanning(); 
                console.log("藍牙已開啟，開始掃描...");
            }
        });

        // 2. 發現裝置 
        noble.on('discover', (peripheral) => {
            if (peripheral.advertisement.localName === "Pico-D") {
                noble.stopScanning(); // 找到就停止掃描，省電
                
                // 3. 連線並尋找服務與特徵
                peripheral.connect((err) => {
                    console.log("連上 Pico-D 了！");
                    
                    // 尋找可以寫入指令的「特徵值」
                    peripheral.discoverAllServicesAndCharacteristics((err, services, chars) => {
                        const writeChar = chars[0]; // 假設第一個就是控制燈的

                        // 4. 真正的傳送 
                        writeChar.write(Buffer.from("on\n"), true, (err) => {
                            if (err) return console.log('傳送失敗');
                            console.log('on數據已成功發送！');
                        });


                        
                        console.log('因為是非同步，所以會先執行這一行：）');
                    });
                });
            }
        });

        const device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'Pico' }], // 根據Pico 廣播名稱設定
            optionalServices: ['nus_service_uuid'] // UUID
        });
        
        console.log("成功連線到：" + device.name);
        alert("Pico 已連線！");
    } catch (error) {
        console.error("連線失敗：", error);
    }
    }

    connectBtn.addEventListener('click', connectToPico);
};