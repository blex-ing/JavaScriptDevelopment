const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost', {connectTimeout:10000}); // Replace with your MQTT broker URL
var contador_StrokeCount = 0;
const originalJson = {
    "basic_machine_data": {
        "StrokeCount": 2, //1-5 x 5 iteraciones 
        "Running": true,
        "PartNumber": "PN12345",
        "PartName": "PartA",
        "PartCounter": 500,
        "Tool": "A20"
      },
      "machine_energy": {
        "Total_Energy": 20.5,
        "Total_ActivePower": 0.3,
        "Energy_Consumption_FeedIn": 300.2,
        "Energy_Consumption_MainDrive": 900.1,
        "Power_FeedIn": 500.4,
        "Power_MainDrive": 700.6
    },
    "machine_press_forces": {
        "Stage1_PressureForce": 100.1,
        "Stage2_PressureForce": 200.2,
        "Stage3_PressureForce": 300.3,
        "Stage4_PressureForce": 400.4,
        "Stage5_PressureForce": 500.5,
        "Stage6_PressureForce": 600.6,
        "Stage1_PF_HL": 10.1,
        "Stage1_PF_HR": 20.2,
        "Stage1_PF_VL": 30.3,
        "Stage1_PF_VR": 40.4,
        "Stage2_PF_HL": 50.5,
        "Stage2_PF_HR": 60.6,
        "Stage2_PF_VL": 70.7,
        "Stage2_PF_VR": 80.8,
        "Stage3_PF_HL": 90.9,
        "Stage3_PF_HR": 100.1,
        "Stage3_PF_VL": 110.2,
        "Stage3_PF_VR": 120.3,
        "Stage4_PF_HL": 130.4,
        "Stage4_PF_HR": 140.5,
        "Stage4_PF_VL": 150.6,
        "Stage4_PF_VR": 160.7,
        "Stage5_PF_HL": 170.8,
        "Stage5_PF_HR": 180.9,
        "Stage5_PF_VL": 190.1,
        "Stage5_PF_VR": 200.2,
        "Stage6_PF_HL": 210.3,
        "Stage6_PF_HR": 220.4,
        "Stage6_PF_VL": 230.5,
        "Stage6_PF_VR": 240.6
    },
    "machine_vibration_data": {
        "Stage1_MainDrive_1_Bearing": 0.1,
        "Stage1_MainDrive_1_RMS": 0.2,
        "Stage2_MainDrive_1_Bearing": 0.3,
        "Stage2_MainDrive_1_RMS": 0.4
    }
};

// Función para generar números aleatorios para cada campo en el objeto JSON
function generateRandomNumbers(jsonObj) {
    for (var key in jsonObj) {
        if (typeof jsonObj[key] === 'object') {
            generateRandomNumbers(jsonObj[key]);
        } else {
            if (typeof jsonObj[key] === 'number') {
                var min = 0;
                var max = 8;
                var tipo = "";
                if (key.includes("StrokeCount")) {
                    contador_StrokeCount += 1;
                } else if (key.includes("Total_ActivePower")) {
                    min = 0.05;
                    max = 1.3;
                } else if (key.includes("Total_Energy")) {

                    tipo = "total";
                } else if (key.includes("Energy_Consumption_FeedIn")) {
                    min = 1;
                    max = 7;
                } else if (key.includes("Energy_Consumption_MainDrive")) {
                    min = 1;
                    max = 5;
                } else if (key.includes("Power_FeedIn") || key.includes("Power_MainDrive")) {
                    min = 20;
                    max = 70;
                } else if (key.includes("Stage1_PressureForce") || key.includes("Stage2_PressureForce") || key.includes("Stage3_PressureForce") || key.includes("Stage4_PressureForce") || key.includes("Stage5_PressureForce") || key.includes("Stage6_PressureForce")) {
                    min = 10;
                    max = 30;
                } else if (key.includes("Stage1_PF_HR") || key.includes("Stage1_PF_VL") || key.includes("Stage1_PF_VR") || key.includes("Stage2_PF_HL") || key.includes("Stage2_PF_HR") || key.includes("Stage2_PF_VL") || key.includes("Stage2_PF_VR") || key.includes("Stage3_PF_HL") || key.includes("Stage3_PF_HR") || key.includes("Stage3_PF_VL") || key.includes("Stage3_PF_VR") || key.includes("Stage4_PF_HL") || key.includes("Stage4_PF_HR") || key.includes("Stage4_PF_VL") || key.includes("Stage4_PF_VR") || key.includes("Stage5_PF_HL") || key.includes("Stage5_PF_HR") || key.includes("Stage5_PF_VL") || key.includes("Stage5_PF_VR") || key.includes("Stage6_PF_HL") || key.includes("Stage6_PF_HR") || key.includes("Stage6_PF_VL") || key.includes("Stage6_PF_VR")) {
                    min = 10;
                    max = 40;
                } else if (key.includes("Stage1_MainDrive_1_Bearing") || key.includes("Stage1_MainDrive_1_RMS") || key.includes("Stage2_MainDrive_1_Bearing") || key.includes("Stage2_MainDrive_1_RMS")) {
                    min = 0;
                    max = 8;
                }

                if (key.includes("Total_Energy"))
                {
                    jsonObj[key] = jsonObj[key] + jsonObj.Total_ActivePower;
                }
                else if(key.includes("StrokeCount"))
                {
                    if (contador_StrokeCount == 5)
                    {
                        jsonObj[key] += 1;
                        contador_StrokeCount = 0;
                    }
                }
                else
                {
                    jsonObj[key] = getRandomNumber(min, max);
                } 
                tipo = "";     
                
                
            }
        }
    }
}

// Función para generar un número aleatorio entre min y max
function getRandomNumber(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}


// // Función para enviar el objeto JSON a través de MQTT
function sendJsonData() {
    const jsonStr = JSON.stringify(originalJson);
    client.publish('A20/machine_data', jsonStr); // Replace 'topic' with your desired MQTT topic
    console.log("json enviado");
}


//Enviar el objeto JSON cada 10 segundos
client.on("connect", () => {
    setInterval(() => {
        generateRandomNumbers(originalJson);
        sendJsonData();
    }, 10000);
   
  });

  client.on("error", () => {
    console.error("timeout");
  });
  


